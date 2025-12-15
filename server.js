const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET / - Health check
app.get('/', (req, res) => {
  res.json({ message: 'NEBULA backend running' });
});

// POST /run - Execute terminal commands
app.post('/run', (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({
      success: false,
      stdout: '',
      stderr: 'No command provided'
    });
  }

  // Execute the command
  exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
    res.json({
      success: !error,
      stdout: stdout || '',
      stderr: stderr || (error ? error.message : '')
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`NEBULA backend listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
