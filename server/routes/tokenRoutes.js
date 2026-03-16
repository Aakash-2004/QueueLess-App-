const express = require('express');
const { generateToken, getTokenStatusByUser, getTokensByService, updateTokenStatus, getQueuePrediction } = require('../controllers/tokenController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/generate', protect, generateToken);
router.get('/status/:userId', protect, getTokenStatusByUser);
router.get('/service/:serviceId', protect, getTokensByService);
router.put('/update/:id', protect, admin, updateTokenStatus);

// AI Wait Time Prediction
router.get('/predict/:serviceId', protect, getQueuePrediction);

module.exports = router;
