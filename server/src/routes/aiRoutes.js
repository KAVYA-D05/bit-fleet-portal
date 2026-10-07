const express = require('express');
const router = express.Router();
const { handleAIChat, getWeatherAdvisory } = require('../controllers/aiAssistantController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, handleAIChat);
router.post('/weather', getWeatherAdvisory);

module.exports = router;
