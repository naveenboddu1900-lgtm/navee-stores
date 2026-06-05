require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/db');
const { seedDemoData } = require('./config/seed');

const port = process.env.PORT || 5000;

async function start() {
  await connectDatabase();
  await seedDemoData();

  const server = app.listen(port, () => {
    console.log(`NAVEE Stores API running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the existing backend or run the app with one npm run dev command.`);
      process.exit(1);
    }
    throw error;
  });
}

start().catch((error) => {
  console.error('Unable to start NAVEE Stores API:', error);
  process.exit(1);
});
