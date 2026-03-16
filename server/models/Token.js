const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  tokenNumber: { type: String, required: true },
  queuePosition: { type: Number, required: true },
  status: { type: String, enum: ['WAITING', 'SERVING', 'COMPLETED', 'CANCELLED'], default: 'WAITING' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', tokenSchema);
