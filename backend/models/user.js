const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Ensure the 'role' field is an array of strings, with a default of 'lecturer'
  role: { type: [String], default: ['lecturer'] }, // Default role is 'lecturer'
});

module.exports = mongoose.model('User', userSchema);
