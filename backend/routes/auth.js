const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).send('User already exists');

    // Default role is set to "lecturer" if not provided
    const userRole = role || 'lecturer';

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: userRole });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid credentials');

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    // Generate a JWT token including user email and role
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // Include role in the token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token and role as response
    res.json({ token, role: user.role, email: user.email });
    
  } catch (err) {
    res.status(500).send('Server error');
  }
});


module.exports = router;
