// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Ensure this path is correct

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => res.send('Jendie Backend is running'));

module.exports = app;
