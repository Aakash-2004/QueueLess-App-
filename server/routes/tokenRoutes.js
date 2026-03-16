const express = require('express');
const { generateToken, getTokenStatusByUser, getTokensByService, updateTokenStatus } = require('../controllers/tokenController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/generate', protect, generateToken);
router.get('/status/:userId', protect, getTokenStatusByUser);
router.get('/service/:serviceId', protect, getTokensByService);
router.put('/update/:id', protect, updateTokenStatus);

module.exports = router;
