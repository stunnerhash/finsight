const express = require('express');
const cors = require('cors');
const budgetRoutes = require('./routes/budgetRoute');
const transactionRoutes = require('./routes/transactionRoute');

const dotenv = require('dotenv');
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/budget', budgetRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Finance API is running!');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('API endpoints:');
  console.log('  GET  /api/budget/categories');
  console.log('  GET  /api/budget/stats');
  console.log('  GET  /api/transactions');
  console.log('  POST /api/transactions');
});
