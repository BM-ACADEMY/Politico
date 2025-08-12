const CandidateManager = require('../models/CandidateManager');

const getAllCandidateManagers = async (req, res) => {
  try {
    const candidateManagers = await CandidateManager.find().populate('user');
    res.json(candidateManagers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCandidateManagerById = async (req, res) => {
  try {
    const candidateManager = await CandidateManager.findById(req.params.id).populate('user');
    if (!candidateManager) {
      return res.status(404).json({ message: 'Candidate Manager not found' });
    }
    res.json(candidateManager);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createCandidateManager = async (req, res) => {
  try {
    const newCandidateManager = new CandidateManager(req.body);
    const savedCandidateManager = await newCandidateManager.save();
    res.status(201).json(savedCandidateManager);
  } catch (error) {
    res.status(400).json({ message: 'Error creating Candidate Manager', error });
  }
};

const updateCandidateManager = async (req, res) => {
  try {
    const updatedCandidateManager = await CandidateManager.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedCandidateManager) {
      return res.status(404).json({ message: 'Candidate Manager not found' });
    }
    res.json(updatedCandidateManager);
  } catch (error) {
    res.status(400).json({ message: 'Error updating Candidate Manager', error });
  }
};

const deleteCandidateManager = async (req, res) => {
  try {
    const deletedCandidateManager = await CandidateManager.findByIdAndDelete(req.params.id);
    if (!deletedCandidateManager) {
      return res.status(404).json({ message: 'Candidate Manager not found' });
    }
    res.json({ message: 'Candidate Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCandidateManagers,
  getCandidateManagerById,
  createCandidateManager,
  updateCandidateManager,
  deleteCandidateManager,
};