const User = require('../models/User');
const jwt = require('jsonwebtoken'); 

// 1. Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, gender, age } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      gender,
      age: age ? Number(age) : undefined,
      role: role || 'student',
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Email verification logic
    res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 3. Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 4. Google Login
const googleLogin = async (req, res) => {
  try {
    // Google Auth Logic
    res.status(200).json({ success: true, message: 'Google auth working' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 5. Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  googleLogin,
  getUserProfile,
};