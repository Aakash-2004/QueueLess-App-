require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Routes
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Service = require('./models/Service');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Security Middlewares
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
// Apply the rate limiting middleware to all requests
app.use(limiter);

// Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/services', async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

// Database Seeding Logic for Services on startup if none exist
const seedServices = async () => {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany([
        { serviceName: 'Electricity Service', description: 'EB related queries and token generation' },
        { serviceName: 'Gas Service', description: 'Gas connection queries and token generation' },
        { serviceName: 'Water Service', description: 'Water connection queries and token generation' },
        { serviceName: 'Property Service', description: 'Property tax and queries' },
        { serviceName: 'Municipal Service', description: 'General municipal corp services' },
      ]);
      console.log('Services seeded successfully');
    }
  } catch(e) {
    console.error('Seeding error', e);
  }
};

// Database Connection
// Database Connection — uses MongoDB Atlas URI from .env (falls back to local)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/queueless-app';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    seedServices();
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
