// controllers/candidateManagerController.js
const CandidateManager = require("../models/CandidateManager");
const User = require("../models/User");
const Role = require("../models/Role");
const Ward = require("../models/Ward");
const { processFile } = require("../utils/upload");
const fs = require("fs");
const path = require("path");

// Utility function to delete a file
const deleteFile = (filePath) => {
  try {
    const serverUrl = process.env.SERVER_URL;
    if (filePath && filePath.startsWith(serverUrl)) {
      const relativePath = filePath.replace(serverUrl, "");
      const fullPath = path.join(__dirname, "../", relativePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      } else {
        console.warn(`File not found for deletion: ${fullPath}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
};

const getAllCandidateManagers = async (req, res) => {
  try {
    const candidateManagers = await CandidateManager.find().populate({
      path: "user",
      populate: [
        { path: "role", select: "name" },
        { path: "ward", select: "ward area district state" },
      ],
    });

    const nullUsers = candidateManagers.filter((cm) => !cm.user);
    const nullProfileImages = candidateManagers.filter((cm) => cm.user && !cm.user.profileImage);
    if (nullUsers.length > 0) {
      console.warn(`Found ${nullUsers.length} candidate managers with null user:`, nullUsers.map((cm) => cm._id));
    }
    if (nullProfileImages.length > 0) {
      console.warn(`Found ${nullProfileImages.length} candidate managers with null profileImage:`, nullProfileImages.map((cm) => cm.user._id));
    }

    res.json(candidateManagers);
  } catch (error) {
    console.error(`Error fetching candidate managers: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const createCandidateManager = async (req, res) => {
  try {
    const { name, phone, email, password, wardId, profileImage } = req.body;
    let finalProfileImage = profileImage || null;

    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      console.log(`Processing profile image: ${file.name}, Type: ${file.mimetype}, Size: ${file.size}`);
      const entityType = "candidateimage";
      const fileName = `${Date.now()}_${file.name}`;

      finalProfileImage = await processFile(
        file.data,
        file.mimetype,
        entityType,
        fileName
      );
      console.log(`Profile image processed: ${finalProfileImage}`);
    } else if (profileImage) {
      console.log(`Using provided profileImage URL: ${profileImage}`);
    } else {
      console.warn("No profile image provided");
    }

    const role = await Role.findOne({ name: "candidate_manager" });
    if (!role) {
      return res.status(400).json({ message: "Candidate Manager role not found" });
    }

    let ward = null;
    if (wardId) {
      ward = await Ward.findById(wardId);
      if (!ward) {
        return res.status(400).json({ message: "Invalid ward ID" });
      }
    }

    const user = new User({
      name,
      phone,
      email: email ? email.toLowerCase() : null,
      password,
      role: role._id,
      ward: ward ? ward._id : null,
      profileImage: finalProfileImage,
      status: "active",
    });

    const savedUser = await user.save();
    console.log(`User created: ${savedUser._id}, Profile Image: ${savedUser.profileImage}`);

    const candidateManager = new CandidateManager({
      user: savedUser._id,
      name,
    });

    const savedCandidateManager = await candidateManager.save();
    console.log(`Candidate manager created: ${savedCandidateManager._id}`);

    res.status(201).json({
      message: "Candidate Manager created successfully",
      candidateManager: await CandidateManager.findById(savedCandidateManager._id).populate({
        path: "user",
        populate: [
          { path: "role", select: "name" },
          { path: "ward", select: "ward area district state" },
        ],
      }),
    });
  } catch (error) {
    console.error(`Error creating candidate manager: ${error.message}`);
    res.status(400).json({ message: "Error creating Candidate Manager", error: error.message });
  }
};

const getCandidateManagerById = async (req, res) => {
  try {
    const candidateManager = await CandidateManager.findById(req.params.id).populate("user");
    if (!candidateManager) {
      return res.status(404).json({ message: "Candidate Manager not found" });
    }
    if (!candidateManager.user) {
      console.warn(`Candidate manager ${req.params.id} has null user`);
    }
    res.json(candidateManager);
  } catch (error) {
    console.error(`Error fetching candidate manager: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCandidateManager = async (req, res) => {
  try {
    const { name, phone, email, wardId, profileImage, userId } = req.body;
    let finalProfileImage = profileImage || null;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      console.log(`Processing updated profile image: ${file.name}`);
      const entityType = "candidateimage";
      const fileName = `${Date.now()}_${file.name}`;

      if (existingUser.profileImage && profileImage !== existingUser.profileImage) {
        deleteFile(existingUser.profileImage);
      }

      finalProfileImage = await processFile(
        file.data,
        file.mimetype,
        entityType,
        fileName
      );
      console.log(`Updated profile image processed: ${finalProfileImage}`);
    } else if (profileImage) {
      console.log(`Using provided profileImage URL: ${profileImage}`);
      if (existingUser.profileImage && profileImage !== existingUser.profileImage) {
        deleteFile(existingUser.profileImage);
      }
    } else {
      console.warn("No new profile image provided, retaining existing");
      finalProfileImage = existingUser.profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, email: email ? email.toLowerCase() : null, ward: wardId, profileImage: finalProfileImage },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedCandidateManager = await CandidateManager.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCandidateManager) {
      return res.status(404).json({ message: "Candidate Manager not found" });
    }

    res.json({
      message: "Candidate Manager updated successfully",
      candidateManager: await CandidateManager.findById(updatedCandidateManager._id).populate({
        path: "user",
        populate: [
          { path: "role", select: "name" },
          { path: "ward", select: "ward area district state" },
        ],
      }),
    });
  } catch (error) {
    console.error(`Error updating candidate manager: ${error.message}`);
    res.status(400).json({ message: "Error updating Candidate Manager", error: error.message });
  }
};

const deleteCandidateManager = async (req, res) => {
  try {
    const candidateManager = await CandidateManager.findById(req.params.id);
    if (!candidateManager) {
      return res.status(404).json({ message: "Candidate Manager not found" });
    }

    if (candidateManager.user) {
      const user = await User.findById(candidateManager.user);
      if (user && user.profileImage) {
        deleteFile(user.profileImage);
      }
      await User.findByIdAndDelete(candidateManager.user);
    } else {
      console.warn(`Candidate manager ${req.params.id} has no associated user`);
    }
    await CandidateManager.findByIdAndDelete(req.params.id);

    res.json({ message: "Candidate Manager deleted successfully" });
  } catch (error) {
    console.error(`Error deleting candidate manager: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllCandidateManagers,
  getCandidateManagerById,
  createCandidateManager,
  updateCandidateManager,
  deleteCandidateManager,
};