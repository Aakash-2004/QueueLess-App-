const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);

module.exports = router;
