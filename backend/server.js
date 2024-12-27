const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db');
const routes = require('./routes/index'); // Main router file

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', routes); // Prefix all API routes with `/api`

// Database connection
db;

// Basic route for testing
app.get('/', (req, res) => res.send('Backend Running ✅'));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
