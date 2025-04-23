const express = require('express');
const Device = require('../models/device');
const router = express.Router();

// Lecturer route to fetch devices
router.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find(); // Get all devices from the Device collection
    res.json(devices);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
