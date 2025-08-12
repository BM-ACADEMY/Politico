const AreaManager = require('../models/AreaManager');

const getAllAreaManagers = async (req, res) => {
  try {
    const areaManagers = await AreaManager.find().populate('user').populate('ward');
    res.json(areaManagers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAreaManagerById = async (req, res) => {
  try {
    const areaManager = await AreaManager.findById(req.params.id).populate('user').populate('ward');
    if (!areaManager) {
      return res.status(404).json({ message: 'Area Manager not found' });
    }
    res.json(areaManager);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createAreaManager = async (req, res) => {
  try {
    const newAreaManager = new AreaManager(req.body);
    const savedAreaManager = await newAreaManager.save();
    res.status(201).json(savedAreaManager);
  } catch (error) {
    res.status(400).json({ message: 'Error creating Area Manager', error });
  }
};

const updateAreaManager = async (req, res) => {
  try {
    const updatedAreaManager = await AreaManager.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedAreaManager) {
      return res.status(404).json({ message: 'Area Manager not found' });
    }
    res.json(updatedAreaManager);
  } catch (error) {
    res.status(400).json({ message: 'Error updating Area Manager', error });
  }
};

const deleteAreaManager = async (req, res) => {
  try {
    const deletedAreaManager = await AreaManager.findByIdAndDelete(req.params.id);
    if (!deletedAreaManager) {
      return res.status(404).json({ message: 'Area Manager not found' });
    }
    res.json({ message: 'Area Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllAreaManagers,
  getAreaManagerById,
  createAreaManager,
  updateAreaManager,
  deleteAreaManager,
};