const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  cpu: { type: Number, required: true },
  memory: { type: Number, required: true },
  disk: { type: Number, required: true },
  network: { type: Number, required: true },
  riskScore: { type: Number, required: true },
  status: { type: String, required: true },
  isoScore: { type: Number, required: true },
  reconstructionLoss: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
});

module.exports = mongoose.model('Log', logSchema);
