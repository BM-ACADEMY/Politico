const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  ward: { type: String, required: true },       // ward name
  area: { type: String, required: true },       // area name
  district: { type: String, required: true },
  state: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Ward', wardSchema);
