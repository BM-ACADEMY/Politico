// app.js
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const path = require("path");

dotenv.config();

const app = express();

// ======== CORS Setup ========
const allowedOrigins = [process.env.CLIENT_URL];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS rejected origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

// ======== Helmet Setup with Custom CSP ========
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:", process.env.SERVER_URL,], // Allow images from backend
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow cross-origin resource sharing

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// Serve static files for uploaded images with CORS headers
app.use(
  "/Uploads",
  (req, res, next) => {
    console.log(`Serving static file: ${req.path}`);
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", "no-store");
    next();
  },
  express.static(path.join(__dirname, "Uploads"))
);

// Routes
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
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/voters", require("./routes/voterRoutes"));


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });