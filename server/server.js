const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/booking');

const app = express();

// =========================
// CORS
// =========================
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://royenza-restaurant-reservation-syst.vercel.app/'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// =========================
// Middleware
// =========================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// =========================
// Routes
// =========================
app.use('/api/bookings', bookingRoutes);

// =========================
// Health Check
// =========================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Royneza API is running 🍽️'
  });
});

// =========================
// MongoDB
// =========================
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  dbName: 'royenzaDB'
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ Error:', err.message));

// =========================
// Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});