const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors

dotenv.config();  // Load environment variables from .env file (if present)

const app = express();
const port = process.env.PORT || 3000;
const ip = process.env.IP;
const secretArn = 'arn:aws:secretsmanager:us-east-1:115228050885:secret:test/tule2_ghaction-ZiZXNi';  // ARN of the secret from Secrets Manager

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' });
const secretsManager = new AWS.SecretsManager();

async function getSecret() {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretArn }).promise();
    if (data.SecretString) {
      const secret = JSON.parse(data.SecretString);
      return secret;
    }
  } catch (err) {
    console.error('Error retrieving secret:', err);
    return {};
  }
}

// Middleware to set environment variable from secret
app.use(async (req, res, next) => {
  const secret = await getSecret();
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
  console.log(`Server running at http://${ip}:${port}`);
});
