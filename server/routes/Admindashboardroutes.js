// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controllers/AdminDashboardController");

router.get("/", adminDashboardController.getDashboardData);

module.exports = router;