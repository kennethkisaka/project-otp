const express = require('express');
const { login, verifyOtp } = require('./authController');
const { requireAuth } = require('./authMiddleware'); //protects certain routes

const router = express.Router();

router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.get('/protected', requireAuth, (req, res) => {
  res.send('Welcome to the protected page!');
});

module.exports = router;
