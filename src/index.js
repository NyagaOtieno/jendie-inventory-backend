const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', saleRoutes);

// Health check
app.get('/', (req, res) => res.send('Jendie Backend is running'));

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
