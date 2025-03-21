// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {connectDB} = require('./config/db');
const patientController = require('./controllers/patientController');
const therapistController = require('./controllers/therapistController');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://mobile-walking-lab-server-b0fhd9bxfmcafgae.westeurope-01.azurewebsites.net'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));
app.use(bodyParser.json());

console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Not Found");

// connect to the server
connectDB().then(() => {
    // Routes
    app.use('/api/patients', patientController);
    app.use('/api/therapists', therapistController);

    // Start the server
    app.listen(PORT,  '0.0.0.0',() => {
        console.log(`Server is running on ${process.env.PORT ? 'Azure App Service' : `http://localhost:${PORT}`}`);
    });
}).catch(err => {
    console.error("Server failed to start due to database connection error:", err);
});