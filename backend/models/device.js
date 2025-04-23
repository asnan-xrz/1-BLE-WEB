const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  deviceName: { type: String, required: true },
  esp32Id: { type: String, required: true }, // The ID of the ESP32 that detected the device
  detectedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Device', deviceSchema);
