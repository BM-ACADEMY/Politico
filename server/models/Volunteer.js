const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: true,
    },
    assignedStreet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Street",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
