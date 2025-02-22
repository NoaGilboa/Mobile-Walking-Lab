const sql = require('mssql');
const dbConfig = require('../config/db');

class PatientDataAccess {
    // קבלת כל המטופלים
    static async getAllPatients() {
        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool.request().query("SELECT * FROM patients;");
            return result.recordset; // מחזיר את רשימת המטופלים
        } catch (error) {
            throw new Error(`Error getting patients: ${error.message}`);
        }
    }

    // הוספת מטופל חדש
    static async addPatient(patientData) {
        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool.request()
                .input('userId', sql.NVarChar, patientData.userId)
                .input('name', sql.NVarChar, patientData.name)
                .input('age', sql.Int, patientData.age)
                .input('condition', sql.NVarChar, patientData.condition)
                .query(`
                    INSERT INTO patients (userId, name, age, condition) 
                    VALUES (@userId, @name, @age, @condition);
                `);
            return result.rowsAffected[0] > 0; // מחזיר true אם נוספה בהצלחה
        } catch (error) {
            throw new Error(`Error adding patient: ${error.message}`);
        }
    }

    // קבלת מטופל לפי מזהה
    static async getPatientById(userId) {
        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool.request()
                .input('userId', sql.NVarChar, userId)
                .query("SELECT * FROM patients WHERE userId = @userId;");
            return result.recordset[0]; 
        } catch (error) {
            throw new Error(`Error retrieving patient: ${error.message}`);
        }
    }

    // קבלת כל ההערות של מטופל
    static async getNotesByPatientId(userId) {
        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool.request()
                .input('userId', sql.NVarChar, userId)
                .query("SELECT note FROM patient_notes WHERE userId = @userId;");
            return result.recordset.map(row => row.note);
        } catch (error) {
            throw new Error(`Error retrieving patient notes: ${error.message}`);
        }
    }

    // הוספת הערה למטופל
    static async addNoteToPatient(userId, note) {
        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool.request()
                .input('userId', sql.NVarChar, userId)
                .input('note', sql.NVarChar, note)
                .query("INSERT INTO patient_notes (userId, note) VALUES (@userId, @note);");
            return result.rowsAffected[0] > 0; // מחזיר true אם נוספה בהצלחה
        } catch (error) {
            throw new Error(`Error adding note to patient: ${error.message}`);
        }
    }

    static async deletePatientsTable() {
        try {
            const pool = await sql.connect(dbConfig);
            
            await pool.request().query("DELETE FROM patient_notes;");
            await pool.request().query("DELETE FROM patients;");
            await pool.request().query("DROP TABLE IF EXISTS patient_notes;");
            await pool.request().query("DROP TABLE IF EXISTS patients;");
            return true;
        } catch (error) {
            throw new Error(`Error deleting patients table: ${error.message}`);
        }
    }
}

module.exports = PatientDataAccess;
