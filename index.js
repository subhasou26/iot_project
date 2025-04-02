require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Define Schema & Model
const gpsSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
  timestamp: { type: Date, default: Date.now },
});

const GPSData = mongoose.model("GPSData", gpsSchema);

// API Endpoint to receive GPS data
app.get("/gpsdata", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const newGPS = new GPSData({ latitude: lat, longitude: lng });
    await newGPS.save();

    res.status(200).json("ok");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
