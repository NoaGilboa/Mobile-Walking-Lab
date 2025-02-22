// services/patientService.js

const PatientDataAccess = require('../dataAccess/patientDataAccess');

class PatientService {
    static async getAllPatients() {
        return await PatientDataAccess.getAllPatients();
    }

    static async addPatient(patientData) {
        return await PatientDataAccess.addPatient(patientData);
    }

    static async getPatientById(userId) {
        return await PatientDataAccess.getPatientById(userId);
    }

    static async getNotesByPatientId(userId) {
        return await PatientDataAccess.getNotesByPatientId(userId);
    }

    static async addNoteToPatient(userId, note) {
        return await PatientDataAccess.addNoteToPatient(userId, note);
    }

    static async deletePatientsTable() {
        return await PatientDataAccess.deletePatientsTable();
    }

}

module.exports = PatientService;

