require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/db');
const { seedDemoData } = require('./config/seed');

const port = process.env.PORT || 5000;

async function start() {
  await connectDatabase();
  await seedDemoData();

  app.listen(port, () => {
    console.log(`Market Place API running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Unable to start Market Place API:', error);
  process.exit(1);
});
