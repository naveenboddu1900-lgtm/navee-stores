const mongoose = require('mongoose');

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    global.__REDX_DB_MODE__ = 'memory';
    console.log('No MONGO_URI found. Market Place is running with seeded in-memory data.');
    return;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGO_URI);
  global.__REDX_DB_MODE__ = 'mongodb';
  console.log('MongoDB connected for Market Place.');
}

function isMongoMode() {
  return global.__REDX_DB_MODE__ === 'mongodb';
}

module.exports = { connectDatabase, isMongoMode };
