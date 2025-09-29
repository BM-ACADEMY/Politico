const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    voter_card_id: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    street_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Street",
      required: true,
    },
    ward_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    religion: {
      type: String,
      default: null,
    },
    community: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voter", voterSchema);