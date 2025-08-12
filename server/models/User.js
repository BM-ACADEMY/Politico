const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true }, // sparse allows multiple docs without email
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
    ward: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
