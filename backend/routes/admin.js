const express = require('express');
const User = require('../models/user');
const router = express.Router();
const Log = require('../models/log');

// Admin can assign the Admin role to a Lecturer
router.put('/assign-role', async (req, res) => {
  const { email } = req.body;

  try {
    // Validate that email is provided
    if (!email) {
      return res.status(400).send('Email is required');
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Ensure the 'role' is an array and add 'admin' if not already present
    if (!Array.isArray(user.role)) {
      user.role = [user.role]; // Convert to array if stored as a string
    }

    if (user.role.includes('admin')) {
      return res.status(400).send('User already has the admin role');
    }

    // Add 'admin' role to the user's roles array
    user.role.push('admin');
    await user.save();

    res.send(`Role for ${email} updated to admin`);
  } catch (err) {
    console.error('Error assigning role:', err);
    res.status(500).send('Server error');
  }
});

// Admin route to fetch logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find(); // Get all logs from the Log collection
    res.json(logs); // Return the logs as a response
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).send('Server error while fetching logs');
  }
});

module.exports = router;
