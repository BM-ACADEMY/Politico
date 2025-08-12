const Ward = require('../models/Ward');

const getAllWards = async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json(wards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getWardById = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    res.json(ward);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createWard = async (req, res) => {
  try {
    const newWard = new Ward(req.body);
    const savedWard = await newWard.save();
    res.status(201).json(savedWard);
  } catch (error) {
    res.status(400).json({ message: 'Error creating ward', error });
  }
};

const updateWard = async (req, res) => {
  try {
    const updatedWard = await Ward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedWard) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    res.json(updatedWard);
  } catch (error) {
    res.status(400).json({ message: 'Error updating ward', error });
  }
};

const deleteWard = async (req, res) => {
  try {
    const deletedWard = await Ward.findByIdAndDelete(req.params.id);
    if (!deletedWard) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    res.json({ message: 'Ward deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllWards,
  getWardById,
  createWard,
  updateWard,
  deleteWard,
};
