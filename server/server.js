// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const patientController = require('./controllers/patientController');
const therapistController = require('./controllers/therapistController');

const app = express();
const PORT = 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from frontend running on port 3000
  }));
app.use(bodyParser.json());

// Routes
app.use('/api/patients', patientController);
app.use('/api/therapists', therapistController);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});