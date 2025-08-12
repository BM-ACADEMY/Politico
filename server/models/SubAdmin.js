const mongoose = require("mongoose");

const subAdminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    assignedArea: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubAdmin", subAdminSchema);
