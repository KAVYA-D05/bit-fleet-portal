const express = require('express');
const router = express.Router();
const { login, googleSSO, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/google-sso', googleSSO);
router.get('/me', protect, getMe);

module.exports = router;
