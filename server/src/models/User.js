const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { 
      type: String, 
      required: function () {
        return this.authProvider === 'local'; 
      } 
    },
    gender: { type: String },
    age: { type: Number },
    studentName: { type: String },
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

// Allow student and parent to share the same email, but ensure only one account per role per email
userSchema.index({ email: 1, role: 1 }, { unique: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    return enteredPassword === this.password;
  }
};

module.exports = mongoose.model('User', userSchema);