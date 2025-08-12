const mongoose = require('mongoose');

const streetSchema = new mongoose.Schema({
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },
  name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Street', streetSchema);
