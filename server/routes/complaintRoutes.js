const express = require('express');
const { createComplaint, getComplaintsByUser, getAllComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', protect, createComplaint);
router.get('/user/:userId', protect, getComplaintsByUser);
router.get('/admin', protect, admin, getAllComplaints);
router.put('/update/:id', protect, admin, updateComplaintStatus);

module.exports = router;
