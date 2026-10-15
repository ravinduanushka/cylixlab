const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Drop obsolete single-field email_1 unique index if present so compound {email, role} works
    try {
      await conn.connection.db.collection('users').dropIndex('email_1');
    } catch {
      // Index already dropped or not present
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;