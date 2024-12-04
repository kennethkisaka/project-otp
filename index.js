require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./authRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "http://127.0.0.1:5500" // Replace with your frontend URL
}));

// MongoDB connection
const uri = "mongodb+srv://user21:S2YCNufpxYXkGwBl@cluster0.qmie4wq.mongodb.net/project-otp?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set('debug', true);

async function run() {
  try {
    await mongoose.connect(uri, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
run().catch(console.dir);

// Routes
app.use('/api/auth', authRoutes); // Protected routes

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
