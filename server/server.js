const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Import routes
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const wardRoutes = require('./routes/wardRoutes');
const streetRoutes = require('./routes/streetRoutes');
const adminRoutes = require('./routes/adminRoutes');
const areaManagerRoutes = require('./routes/areaManagerRoutes');
const candidateManagerRoutes = require('./routes/candidateManagerRoutes');
const subAdminRoutes = require('./routes/subAdminRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/streets', streetRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/area-managers', areaManagerRoutes);
app.use('/api/candidate-managers', candidateManagerRoutes);
app.use('/api/sub-admins', subAdminRoutes);
app.use('/api/volunteers', volunteerRoutes);

// Define a simple root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));