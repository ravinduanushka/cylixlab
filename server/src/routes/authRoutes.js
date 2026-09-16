const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyEmail,
  loginUser,
  googleLogin,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/profile', protect, getUserProfile);

module.exports = router;