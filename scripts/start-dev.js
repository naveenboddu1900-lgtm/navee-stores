const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const path = require('path');

const root = path.resolve(__dirname, '..');
const backendPort = Number(process.env.PORT || 5000);
const frontendPort = Number(process.env.FRONTEND_PORT || 5173);
const maxWaitMs = 30000;

function isPortInUse(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: '127.0.0.1' });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}

function run(name, cwd) {
  const command = process.platform === 'win32' ? 'cmd.exe' : 'npm';
  const args = process.platform === 'win32' ? ['/d', '/s', '/c', 'npm.cmd', 'run', 'dev'] : ['run', 'dev'];
  const child = spawn(command, args, {
    cwd: path.join(root, cwd),
    stdio: 'inherit',
    shell: false
  });

  child.on('exit', (code) => {
    if (code) console.error(`${name} exited with code ${code}`);
  });

  return child;
}

function healthCheck() {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${backendPort}/api/health`, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
    req.on('error', () => resolve(false));
  });
}

async function waitForBackend() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < maxWaitMs) {
    if (await healthCheck()) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

let backend;
let frontend;
let shuttingDown = false;

function startBackend() {
  backend = run('backend', 'backend');
  backend.on('exit', (code) => {
    if (shuttingDown || code === 0) return;
    console.error('Backend stopped. Restarting to keep the Vite proxy alive...');
    startBackend();
  });
}

function startFrontend() {
  frontend = run('frontend', 'frontend');
}

async function start() {
  if (await isPortInUse(backendPort)) {
    console.log(`Backend already running on http://127.0.0.1:${backendPort}.`);
  } else {
    startBackend();
  }

  const ready = await waitForBackend();
  if (!ready) {
    console.error(`Backend did not become ready on http://127.0.0.1:${backendPort}/api/health.`);
    console.error('Frontend was not started because Vite proxy calls would fail.');
    process.exit(1);
  }

  console.log(`Backend ready on http://127.0.0.1:${backendPort}.`);
  if (await isPortInUse(frontendPort)) {
    console.log(`Frontend already running on http://localhost:${frontendPort}.`);
    return;
  }

  startFrontend();
  console.log(`Frontend starting on http://localhost:${frontendPort}.`);
}

function shutdown() {
  shuttingDown = true;
  if (backend) backend.kill();
  if (frontend) frontend.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start().catch((error) => {
  console.error('Unable to start NAVEE Stores dev servers:', error);
  process.exit(1);
});
