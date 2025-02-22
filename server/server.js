// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {connectDB} = require('./config/db');
const patientController = require('./controllers/patientController');
const therapistController = require('./controllers/therapistController');
require('dotenv').config();


const app = express();
const PORT = 5001;

// Middleware
app.use(cors({ origin: '*' })); 
app.use(bodyParser.json());

console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Not Found");

// connect to the server
connectDB().then(() => {
    // Routes
    app.use('/api/patients', patientController);
    app.use('/api/therapists', therapistController);

    // Start the server
    app.listen(PORT,  '0.0.0.0',() => {
        console.log(`Server is running on http://192.168.1.175:${PORT}`);
    });
}).catch(err => {
    console.error("Server failed to start due to database connection error:", err);
});