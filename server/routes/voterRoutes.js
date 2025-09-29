const express = require("express");
const router = express.Router();
const voterController = require("../controllers/voterController");

// Create a voter
router.post("/", voterController.createVoter);

// Get all voters
router.get("/", voterController.getAllVoters);

// Get a single voter
router.get("/:id", voterController.getVoter);

// Update a voter
router.put("/:id", voterController.updateVoter);

// Delete a voter
router.delete("/:id", voterController.deleteVoter);

module.exports = router;