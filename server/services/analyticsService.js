// Analytics Service Pipeline
const User = require('../models/User');
const Token = require('../models/Token');
const Complaint = require('../models/Complaint');

/**
 * Aggregates core system stats for the overview cards
 */
exports.getOverviewStats = async () => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTokens = await Token.countDocuments();
    const activeTokens = await Token.countDocuments({ status: { $in: ['WAITING', 'SERVING'] } });
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'RESOLVED' });

    return { totalUsers, totalTokens, activeTokens, totalComplaints, resolvedComplaints };
  } catch (error) {
    throw error;
  }
};

/**
 * Aggregates service usage to see which departments are the most active
 */
exports.getServiceUsageStats = async () => {
  try {
    const usage = await Token.aggregate([
      {
        $lookup: {
          from: 'services', // Assuming the collection name is 'services'
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $group: {
          _id: '$service.serviceName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Format for Recharts consumption
    return usage.map(item => ({
      name: item._id,
      value: item.count
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Breaks down complaints by status for pie charts
 */
exports.getComplaintStats = async () => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return stats.map(item => ({
      name: item._id,
      value: item.count
    }));
  } catch (error) {
    throw error;
  }
};
