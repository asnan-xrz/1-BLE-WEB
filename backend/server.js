const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
require('dotenv').config();
const Device = require('./models/device');
const Log = require('./models/log');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ---------------------------------------------------------------------------------------------------------------------------

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://localhost'); // Use your broker's URL

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('esp32/device-data', (err) => {
    if (err) {
      console.error('Error subscribing to topic:', err);
    } else {
      console.log('Successfully subscribed to esp32/device-data');
    }
  });
});

// Listen for messages on the esp32/device-data topic
client.on('message', async (topic, message) => {
  if (topic === 'esp32/device-data') {
    const deviceData = JSON.parse(message.toString()); // Parse the incoming JSON message

    console.log('Received device data:', deviceData);

    // Save data to the Device model
    try {
      const device = new Device({
        deviceId: deviceData.deviceId,
        deviceName: deviceData.deviceName,
        esp32Id: deviceData.esp32Id,
        detectedAt: new Date(deviceData.detectedAt),
      });
      await device.save();
      console.log('Device data saved:', device);

      // Save data to the Log model
      const log = new Log({
        deviceId: deviceData.deviceId,
        esp32Id: deviceData.esp32Id,
        timestamp: new Date(),
      });
      await log.save();
      console.log('Log data saved:', log);
    } catch (err) {
      console.error('Error saving data to the database:', err);
    }
  }
});

// -----------------------------------------------------------------------------------------------------------------------------

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const lecturerRoutes = require('./routes/lecturer');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lecturer', lecturerRoutes);

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
