const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan"); // <-- import morgan
const helmet = require("helmet"); // <-- import helmet
// Load environment variables
dotenv.config();

const app = express();

// ======== CORS Setup ========
const allowedOrigins = [
  process.env.CLIENT_URL,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Morgan for request logging
app.use(morgan("dev")); // or 'combined' for more details

// Helmet for security headers
app.use(helmet()); 
// ======== Middleware ========
app.use(express.json());
app.use(cookieParser());


// ======== Routes ========
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/wards", require("./routes/wardRoutes"));
app.use("/api/streets", require("./routes/streetRoutes"));
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/area-managers", require("./routes/areaManagerRoutes"));
app.use("/api/candidate-managers", require("./routes/candidateManagerRoutes"));
app.use("/api/sub-admins", require("./routes/subAdminRoutes"));
app.use("/api/volunteers", require("./routes/volunteerRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ======== Connect DB then Start Server ========
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1); // stop the app if DB connection fails
  });
