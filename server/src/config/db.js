const mongoose = require('mongoose');
const dns = require('dns');

// Ensure reliable DNS resolution for mongodb+srv:// records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

let cachedConn = null;
let cachedPromise = null;

const connectDB = async () => {
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  if (mongoose.connection.readyState === 1) {
    cachedConn = mongoose.connection;
    return cachedConn;
  }

  if (!cachedPromise) {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    cachedPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => {
        cachedConn = m.connection;
        console.log(`✅ MongoDB Connected: ${m.connection.host}`);
        return cachedConn;
      })
      .catch((err) => {
        cachedPromise = null;
        cachedConn = null;
        console.error(`❌ MongoDB Connection Error: ${err.message}`);
        throw err;
      });
  }

  try {
    await cachedPromise;
    return cachedConn;
  } catch (e) {
    cachedPromise = null;
    cachedConn = null;
    throw e;
  }
};

module.exports = connectDB;
