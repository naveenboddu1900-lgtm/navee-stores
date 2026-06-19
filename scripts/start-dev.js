const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..');
const backendHealthUrl = new URL(process.env.BACKEND_HEALTH_URL || 'http://localhost:5000/api/health');

function run(name, cwd) {
  const command = process.platform === 'win32' ? 'cmd.exe' : 'npm';
  const args = process.platform === 'win32' ? ['/c', 'npm', 'run', 'dev'] : ['run', 'dev'];
  const child = spawn(command, args, {
    cwd: path.join(root, cwd),
    stdio: 'inherit'
  });

  child.on('exit', (code) => {
    if (code) console.error(`${name} exited with code ${code}`);
  });

  return child;
}

const backend = run('backend', 'backend');
let frontend = null;

function waitForBackend(retries = 40) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function check() {
      attempts += 1;
      const request = http.get(backendHealthUrl, (response) => {
        response.resume();
        if (response.statusCode >= 200 && response.statusCode < 500) {
          resolve();
          return;
        }
        retry();
      });

      request.on('error', retry);
      request.setTimeout(1500, () => {
        request.destroy();
        retry();
      });
    }

    function retry() {
      if (attempts >= retries) {
        reject(new Error(`Backend did not become ready at ${backendHealthUrl.href}`));
        return;
      }
      setTimeout(check, 1000);
    }

    check();
  });
}

waitForBackend()
  .then(() => {
    console.log(`Backend ready at ${backendHealthUrl.href}. Starting frontend...`);
    frontend = run('frontend', 'frontend');
  })
  .catch((error) => {
    console.error(error.message);
    backend.kill();
    process.exit(1);
  });

function shutdown() {
  backend.kill();
  if (frontend) frontend.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
