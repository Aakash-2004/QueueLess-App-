const Token = require('../models/Token');
const Service = require('../models/Service');

exports.generateToken = async (req, res) => {
  try {
    const { userId, serviceId } = req.body;
    
    // Calculate Queue Position
    const currentTokens = await Token.find({ serviceId, status: { $in: ['WAITING', 'SERVING'] } });
    const queuePosition = currentTokens.length + 1;
    
    // Generate Token Number e.g., SRV-001
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    const tokenPrefix = service.serviceName.substring(0, 3).toUpperCase();
    const tokenNumber = `${tokenPrefix}-${Date.now().toString().slice(-4)}`;

    const token = await Token.create({
      userId,
      serviceId,
      tokenNumber,
      queuePosition,
      status: 'WAITING'
    });

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTokenStatusByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tokens = await Token.find({ userId }).populate('serviceId').sort('-createdAt');
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTokensByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const tokens = await Token.find({ serviceId, status: { $in: ['WAITING', 'SERVING'] } }).populate('userId', 'fullName phoneNumber').sort('createdAt');
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTokenStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const token = await Token.findByIdAndUpdate(id, { status }, { new: true });
    if (!token) return res.status(404).json({ message: 'Token not found' });
    
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
