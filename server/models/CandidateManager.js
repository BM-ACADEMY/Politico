const mongoose = require("mongoose");

const candidateManagerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CandidateManager", candidateManagerSchema);
