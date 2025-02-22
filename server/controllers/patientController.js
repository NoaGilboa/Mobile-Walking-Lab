// controllers/patientController.js

const express = require('express');
const router = express.Router();
const PatientService = require('../services/patientService');
const { getTreatmentRecommendation } = require('../services/openAIService');

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await PatientService.getAllPatients();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new patient
router.post('/', async (req, res) => {
    try {
        const { userId, name, age, condition } = req.body;
        const newPatient = await PatientService.addPatient({userId, name, age, condition });
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get details of a specific patient by ID
router.get('/:userId', async (req, res) => {
    try {
        const patient = await PatientService.getPatientById(req.params.userId);
        if (patient) {
            res.json(patient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get notes for a specific patient by userId
router.get('/:userId/notes', async (req, res) => {
    try {
          const patientId = req.params.userId;
          const notes = await PatientService.getNotesByPatientId(patientId);
          if (notes) {
              res.json(notes);
          } else {
              res.status(404).json({ message: 'Patient not found' });
          }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a note for a specific patient by ID
router.post('/:userId/notes', async (req, res) => {
    try {
        const { note } = req.body;
        const updatedPatient = await PatientService.addNoteToPatient(req.params.userId, note);
        if (updatedPatient) {
            res.status(201).json({ message: 'Note added successfully', updatedPatient });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete-table', async (req, res) => {
    try {
        await PatientService.deletePatientsTable();
        res.status(200).json({ message: 'טבלת המטופלים נמחקה בהצלחה!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// קבלת המלצת טיפול ממנוע ה-AI
router.get('/:userId/get-treatment-recommendation', async (req, res) => {
    try {
        const patient = await PatientService.getPatientById(req.params.userId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const recommendation = await getTreatmentRecommendation(patient);
        res.json({ recommendation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
