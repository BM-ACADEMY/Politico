const Voter = require("../models/VoterModel");

// Create a voter
const createVoter = async (req, res) => {
  try {
    const voter = new Voter({
      ...req.body,
    });

    await voter.save();
    const populatedVoter = await Voter.findById(voter._id)
      .populate("street_id", "name")
      .populate("ward_id", "ward");
    res.status(201).json({ success: true, data: populatedVoter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });1
  }
};

// Get all voters
const getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.find()
      .populate("street_id", "name")
      .populate("ward_id", "ward");
    res.json({ success: true, data: voters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single voter
const getVoter = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id)
      .populate("street_id", "name")
      .populate("ward_id", "ward");
    if (!voter) return res.status(404).json({ success: false, message: "Voter not found" });
    res.json({ success: true, data: voter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update voter
const updateVoter = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);
    if (!voter) return res.status(404).json({ success: false, message: "Voter not found" });

    Object.assign(voter, req.body);
    await voter.save();
    const populatedVoter = await Voter.findById(voter._id)
      .populate("street_id", "name")
      .populate("ward_id", "ward");
    res.json({ success: true, data: populatedVoter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete voter
const deleteVoter = async (req, res) => {
  try {
    const voter = await Voter.findByIdAndDelete(req.params.id);
    if (!voter) return res.status(404).json({ success: false, message: "Voter not found" });
    res.json({ success: true, message: "Voter deleted successfully" });
  } catch (error) {
    console.error("Error deleting voter:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createVoter,
  getAllVoters,
  getVoter,
  updateVoter,
  deleteVoter,
};