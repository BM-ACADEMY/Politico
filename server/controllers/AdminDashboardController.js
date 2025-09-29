// controllers/AdminDashboardController.js
const CandidateManager = require("../models/CandidateManager");
const Ward = require("../models/Ward");
const Voter = require("../models/VoterModel");
const mongoose = require("mongoose");

const getDashboardData = async (req, res) => {
  try {
    const { filter = "month" } = req.query; // Default to monthly filter

    // Fetch totals
    const totalCandidates = await CandidateManager.countDocuments();
    const totalWards = await Ward.countDocuments();
    const totalVoters = await Voter.countDocuments();

    // Fetch voter data for the area chart
    let voterData = [];
    const now = new Date();
    let startDate;

    if (filter === "day") {
      // Last 7 days
      startDate = new Date(now.setDate(now.getDate() - 7));
      voterData = await Voter.aggregate([
        {
          $match: { createdAt: { $gte: startDate } },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            voters: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            name: "$_id",
            voters: 1,
            _id: 0,
          },
        },
      ]);
    } else if (filter === "week") {
      // Last 4 weeks
      startDate = new Date(now.setDate(now.getDate() - 28));
      voterData = await Voter.aggregate([
        {
          $match: { createdAt: { $gte: startDate } },
        },
        {
          $group: {
            _id: { $week: "$createdAt" },
            voters: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            name: { $concat: ["Week ", { $toString: "$_id" }] },
            voters: 1,
            _id: 0,
          },
        },
      ]);
    } else {
      // Last 7 months (default)
      startDate = new Date(now.setMonth(now.getMonth() - 7));
      voterData = await Voter.aggregate([
        {
          $match: { createdAt: { $gte: startDate } },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            voters: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            name: "$_id",
            voters: 1,
            _id: 0,
          },
        },
      ]);
    }

    // Fetch wards distribution for pie chart
    const wardsData = await Ward.aggregate([
      {
        $group: {
          _id: "$ward",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    // Fetch candidates by party for bar chart
    const candidatesData = await CandidateManager.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $group: {
          _id: "$user.party", // Assuming 'party' is a field in the User model
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          name: { $ifNull: ["$_id", "Independents"] },
          value: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totals: {
          candidates: totalCandidates,
          wards: totalWards,
          voters: totalVoters,
        },
        chartData: voterData,
        wardsData,
        candidatesData,
      },
    });
  } catch (error) {
    console.error(`Error fetching dashboard data: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getDashboardData,
};