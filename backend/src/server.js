require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/db');
const { seedDemoData } = require('./config/seed');

const port = process.env.PORT || 5000;

async function start() {
  await connectDatabase();
  await seedDemoData();

  const server = app.listen(port, () => {
    console.log(`Market Place API running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the running backend or set PORT to another value.`);
      process.exit(1);
    }
    throw error;
  });
}

start().catch((error) => {
  console.error('Unable to start Market Place API:', error);
  process.exit(1);
});
