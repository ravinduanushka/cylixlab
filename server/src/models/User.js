const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { 
      type: String, 
      required: function () {
        return this.authProvider === 'local'; 
      } 
    },
    gender: { type: String },
    age: { type: Number },
    role: {
      type: String,
      enum: ['student', 'parent', 'teacher', 'admin'],
      default: 'student',
    },
    grade: { type: String, default: null },

    // Email Verification Fields
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpire: Date,

    // Google Auth Fields
    googleId: String,
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);