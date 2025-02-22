// controllers/therapistController.js

const express = require('express');
const router = express.Router();
const TherapistService = require('../services/therapistService');

// Register a new therapist
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const newTherapist = await TherapistService.registerTherapist({ email, password, name });
        res.status(201).json(newTherapist);
    } catch (error) {
        console.error("Registration failed:", error);
        res.status(500).json({ error: error.message });
    }
});

// Login a therapist
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const therapist = await TherapistService.loginTherapist(email, password);
        if (therapist) {
            res.json({ message: 'Login successful', therapist });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


