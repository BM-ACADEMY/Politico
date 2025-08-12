const mongoose = require("mongoose");

const areaManagerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    ward: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
    assignedZone: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AreaManager", areaManagerSchema);
