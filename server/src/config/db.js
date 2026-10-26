const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Reuse existing connection if already open (essential for Vercel serverless)
  if (isConnected || mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Drop obsolete single-field email_1 unique index if present so compound {email, role} works
    try {
      await conn.connection.db.collection('users').dropIndex('email_1');
    } catch {
      // Index already dropped or not present
    }

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      // In local development, don't crash hard immediately if MongoDB is momentarily offline
    }
  }
};

module.exports = connectDB;
