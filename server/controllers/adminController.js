const User = require('../models/User');
const Token = require('../models/Token');
const Complaint = require('../models/Complaint');
const analyticsService = require('../services/analyticsService');

exports.getAdminStats = async (req, res) => {
  try {
    const overview = await analyticsService.getOverviewStats();
    const serviceUsage = await analyticsService.getServiceUsageStats();
    const complaintStats = await analyticsService.getComplaintStats();

    res.json({
      ...overview,
      serviceUsage,
      complaintStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
