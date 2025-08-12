const SubAdmin = require('../models/SubAdmin');

const getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find().populate('user');
    res.json(subAdmins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubAdminById = async (req, res) => {
  try {
    const subAdmin = await SubAdmin.findById(req.params.id).populate('user');
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub Admin not found' });
    }
    res.json(subAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createSubAdmin = async (req, res) => {
  try {
    const newSubAdmin = new SubAdmin(req.body);
    const savedSubAdmin = await newSubAdmin.save();
    res.status(201).json(savedSubAdmin);
  } catch (error) {
    res.status(400).json({ message: 'Error creating Sub Admin', error });
  }
};

const updateSubAdmin = async (req, res) => {
  try {
    const updatedSubAdmin = await SubAdmin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedSubAdmin) {
      return res.status(404).json({ message: 'Sub Admin not found' });
    }
    res.json(updatedSubAdmin);
  } catch (error) {
    res.status(400).json({ message: 'Error updating Sub Admin', error });
  }
};

const deleteSubAdmin = async (req, res) => {
  try {
    const deletedSubAdmin = await SubAdmin.findByIdAndDelete(req.params.id);
    if (!deletedSubAdmin) {
      return res.status(404).json({ message: 'Sub Admin not found' });
    }
    res.json({ message: 'Sub Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllSubAdmins,
  getSubAdminById,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
};