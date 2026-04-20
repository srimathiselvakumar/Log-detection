require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const axios = require('axios');

const User = require('./models/User');
const Log = require('./models/Log');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ===== AUTH ROUTES =====

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // For production, return a JWT token here. Keeping it simplistic as per initial setup.
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      },
      token: "dummy-jwt-token" // Replace with real JWT auth if needed
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ===== PREDICTION / LOGS ROUTES =====

app.post('/api/predict', async (req, res) => {
  try {
    // 1. Send data to FastAPI ML model
    const mlResponse = await axios.post('http://127.0.0.1:8000/predict', req.body);
    const prediction = mlResponse.data;

    // 2. Save the trace into MongoDB Log Collection
    const newLog = new Log({
      cpu: req.body.cpu,
      memory: req.body.memory,
      disk: req.body.disk,
      network: req.body.network,
      riskScore: prediction.risk,
      status: prediction.status,
      isoScore: prediction.iso_score,
      reconstructionLoss: prediction.reconstruction_loss
    });

    await newLog.save();

    // 3. Return ML prediction to Frontend
    res.json(prediction);
  } catch (error) {
    console.error('Prediction Error:', error?.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process prediction. Is the ML service running on port 8000?'
    });
  }
});

// Fetch all logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    console.error('Log fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve logs'
    });
  }
});

// ===== SIMULATOR ROUTES =====

let isSimulating = false;
let simulationInterval = null;

const runSimulationTick = async () => {
  if (!isSimulating) return;

  // Generate plausible randomized server metrics with slight chance of extreme anomaly
  const hasAnomaly = Math.random() > 0.8; // 20% chance to force an extreme spike
  const data = {
    cpu: hasAnomaly ? 85 + Math.random() * 15 : 20 + Math.random() * 50,
    memory: hasAnomaly ? 50 + Math.random() * 14 : 10 + Math.random() * 30, // Assuming 64GB max
    disk: hasAnomaly ? 80 + Math.random() * 20 : 30 + Math.random() * 40,
    network: hasAnomaly ? 800 + Math.random() * 200 : 100 + Math.random() * 400
  };

  try {
    const mlResponse = await axios.post('http://127.0.0.1:8000/predict', data);
    const prediction = mlResponse.data;

    const newLog = new Log({
      cpu: data.cpu.toFixed(1),
      memory: data.memory.toFixed(1),
      disk: data.disk.toFixed(1),
      network: data.network.toFixed(1),
      riskScore: prediction.risk,
      status: prediction.status,
      isoScore: prediction.iso_score,
      reconstructionLoss: prediction.reconstruction_loss
    });
    
    await newLog.save();
    console.log(`[Simulator] Log saved: Risk ${prediction.risk}% | Status: ${prediction.status}`);
  } catch (err) {
    console.error("[Simulator Error] Could not connect to ML Server.");
  }
};

app.post('/api/simulation/toggle', (req, res) => {
  isSimulating = !isSimulating;
  if (isSimulating) {
    simulationInterval = setInterval(runSimulationTick, 5000);
    runSimulationTick();
  } else {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  res.json({ isSimulating });
});

app.get('/api/simulation/status', (req, res) => {
  res.json({ isSimulating });
});

// Dashboard Proxies
app.get('/api/dashboard/metrics', async (req, res) => {
  try {
    const mlResponse = await axios.get('http://127.0.0.1:8000/dashboard/metrics');
    res.json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics from ML server' });
  }
});

app.get('/api/dashboard/recent-activities', async (req, res) => {
  try {
    const mlResponse = await axios.get('http://127.0.0.1:8000/dashboard/recent-activities');
    res.json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "Backend Running Successfully" });
});

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.get('/api/auth/google', (req, res) => res.redirect(`${frontendUrl}/dashboard`));
app.get('/api/auth/github', (req, res) => res.redirect(`${frontendUrl}/dashboard`));
app.get('/api/auth/microsoft', (req, res) => res.redirect(`${frontendUrl}/dashboard`));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const { spawn } = require('child_process');

// Start Python ML API automatically
// Use python3 on Render/Linux, python on Windows local
const pythonCmd = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
const pythonProcess = spawn(pythonCmd, ['-m', 'uvicorn', 'api:app', '--port', '8000', '--host', '0.0.0.0']);

pythonProcess.stdout.on('data', (data) => console.log(`[Python API] ${data.toString().trim()}`));
pythonProcess.stderr.on('data', (data) => console.error(`[Python API] ${data.toString().trim()}`));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
});