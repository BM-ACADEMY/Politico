const Voter = require("../models/VoterModel");
const { processFile } = require("../utils/upload");
const fs = require("fs").promises; // Use promises for async file operations
const path = require("path");

// Create a voter
const createVoter = async (req, res) => {
  try {
    let profile_image_url = null;

    // Handle profile image upload
    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      const fileName = `${Date.now()}_${file.name}`;
      profile_image_url = await processFile(file.data, file.mimetype, "voters", fileName);
    }

    const voter = new Voter({
      ...req.body,
      profile_image: profile_image_url,
    });

    await voter.save();
    // Populate ward_id and street_id
    const populatedVoter = await Voter.findById(voter._id)
      .populate("street_id", "name")
      .populate("ward_id", "ward"); // Use "ward" instead of "name"
    res.status(201).json({ success: true, data: populatedVoter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
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
      .populate("ward_id", "name");
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

    // Update profile image if provided
    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      const fileName = `${Date.now()}_${file.name}`;
      voter.profile_image = await processFile(file.data, file.mimetype, "voters", fileName);
    }

    // Update other fields
    Object.assign(voter, req.body);

    await voter.save();
    // Populate ward_id and street_id
    const populatedVoter = await Voter.findById(voter._id)
      .populate("street_id", "name")
      .populate("ward_id", "ward"); // Use "ward" instead of "name"
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

    // Optional: Delete profile image from server
    if (voter.profile_image) {
      try {
        const filePath = path.join(__dirname, "../Uploads/voters", path.basename(voter.profile_image));
        await fs.unlink(filePath);
        console.log(`Successfully deleted image: ${filePath}`);
      } catch (err) {
        console.warn("Failed to delete image:", err.message);
        // Do not throw an error here; file deletion is optional and shouldn't block the response
      }
    }

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
