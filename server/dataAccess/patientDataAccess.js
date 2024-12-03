// dataAccess/patientDataAccess.js

const Patient = require('../models/patient');

class PatientDataAccess {
    static async getAllPatients() {
        return await Patient.find();
    }

    static async addPatient(patientData) {
        const patient = new Patient(patientData);
        return await patient.save();
    }

    static async getPatientById(userId) {
        return await Patient.findOne({ userId });
    }

    static async getNotesByPatientId(userId) {
        const patient = await Patient.findOne({ userId });
        return patient?.notes || [];
    }

    static async addNoteToPatient(userId, note) {
        const patient = await Patient.findOne({ userId });
        if (patient) {
            patient.notes.push(note);
            return await patient.save();
        }
        return null;
    }
}

module.exports = PatientDataAccess;

// let patients = [];
// let patientNotes = {};

// class PatientDataAccess {
//   static getAllPatients() {
//     return patients;
//   }

//   static addPatient(patient) {
//     patients.push(patient);
//     return patient;
//   }

//   static getPatientById(id) {
//     return patients.find((p) => p.id == id);
//   }

//   static getNotesByPatientId(id) {
//     return patientNotes[id] || [];
//   }

//   static addNoteToPatient(id, note) {
//     if (!patientNotes[id]) {
//       patientNotes[id] = [];
//     }
//     patientNotes[id].push(note);
//     return note;
//   }
// }

// module.exports = PatientDataAccess;
