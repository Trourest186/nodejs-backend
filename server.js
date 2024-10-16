const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors

dotenv.config();  // Load environment variables from .env file (if present)

const app = express();
const port = process.env.PORT || 3000;
const ip = process.env.IP || "0.0.0.0";


// Middleware to set environment variable from secret
app.use(async (req, res, next) => {
  process.env.MESSAGE = secret.MESSAGE || 'Hello from backend!';
  next();
});

// Use cors middleware to enable CORS for all origins
app.use(cors()); // Allows all origins by default

// Health check endpoint for ALB
app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK'); // Respond with HTTP 200 to indicate healthy status
});

// Serve static files for frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API endpoint to return message from environment variable
app.get('/api/message', (req, res) => {
  res.json({ message: process.env.MESSAGE });
});

// API endpoint to receive data from frontend (POST request)
app.post('/api/send-data', express.json(), (req, res) => {
  const data = req.body;
  console.log('Received data:', data);
  res.json({ status: 'success', receivedData: data });
});

app.listen(port, () => {
  console.log(`!!! Server running Trourest =.= at http://0.0.0.0:${port}`);
});
