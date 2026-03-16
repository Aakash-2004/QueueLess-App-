const User = require('../models/User');
const Token = require('../models/Token');
const Complaint = require('../models/Complaint');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTokens = await Token.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    
    // Calculate current serving tokens and queue length
    const activeTokens = await Token.countDocuments({ status: { $in: ['WAITING', 'SERVING'] } });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'RESOLVED' });

    res.json({
      totalUsers,
      totalTokens,
      totalComplaints,
      activeTokens,
      resolvedComplaints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
