const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  try {
    const { userId, serviceType, complaintText } = req.body;
    
    const complaint = await Complaint.create({
      userId,
      serviceType,
      complaintText,
      status: 'OPEN'
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaintsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const complaints = await Complaint.find({ userId }).sort('-createdAt');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    // Optional ?serviceType=Gas+Service filter for department-specific admin views
    const filter = {};
    if (req.query.serviceType) filter.serviceType = req.query.serviceType;

    const complaints = await Complaint.find(filter).populate('userId', 'fullName phoneNumber').sort('-createdAt');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
