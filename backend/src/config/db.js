const mongoose = require('mongoose');

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    global.__REDX_DB_MODE__ = 'memory';
    console.log('No MONGO_URI found. NAVEE Stores is running with seeded in-memory data.');
    return;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGO_URI);
  global.__REDX_DB_MODE__ = 'mongodb';
  console.log('MongoDB connected for NAVEE Stores.');
}

function isMongoMode() {
  return global.__REDX_DB_MODE__ === 'mongodb';
}

module.exports = { connectDatabase, isMongoMode };
