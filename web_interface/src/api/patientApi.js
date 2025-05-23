import axios from 'axios';
import { BASE_URL } from './apiConfig';

// Function to add a new patient
export const addPatient = (patientData) => {
  return axios.post(`${BASE_URL}/patients`, patientData);
};

// Function to get all patients
export const getAllPatients = () => {
  return axios.get(`${BASE_URL}/patients`);
};

// Function to get patient details by ID
export const getPatientById = (userId) => {
    return axios.get(`${BASE_URL}/patients/${userId}`);
  };
  
  // Function to get notes by patient ID
  export const getNotesByPatientId = (userId) => {
    return axios.get(`${BASE_URL}/patients/${userId}/notes`);
  };
  
  // Function to add a note to a patient by ID
  export const addNoteToPatient = (patientId, therapistId, note) => {
    return axios.post(`${BASE_URL}/patients/${patientId}/notes`, {
      therapistId,
      note
    });
  };

  export const getTreatmentRecommendation = (userId) => {
    return axios.get(`${BASE_URL}/patients/${userId}/get-treatment-recommendation`);
  };
  