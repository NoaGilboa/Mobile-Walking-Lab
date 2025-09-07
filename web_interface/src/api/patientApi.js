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
export const getPatientById = (id) => {
    return axios.get(`${BASE_URL}/patients/${id}`);
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

  export const getTreatmentRecommendation = (id) => {
    return axios.post(`${BASE_URL}/patients/${id}/treatment-recommendation`);
  };

  export const saveSpeedMeasurement = (patientId, speedKmh) => {
  return axios.post(`${BASE_URL}/patients/${patientId}/speed`, {
    speed_kmh: speedKmh,
    source: 'manual',
    foot_lift_count: null
  });
};

export const getSpeedHistory = (patientId) => {
  return axios.get(`${BASE_URL}/patients/${patientId}/speed-history`);
};

export const getPatientsPaged = (opts = {}) => {
  return axios.get(`${BASE_URL}/patients`, { params: toParams(opts) })
    .then(({ data }) => normalizePaged(data));
};

export const getNotesByPatientIdPaged = (patientId, opts = {}) =>
  axios.get(`${BASE_URL}/patients/${patientId}/notes`, { params: toParams(opts) })
    .then(({ data }) => normalizePaged(data));


 const toParams = (opts = {}) => {
  const { page, pageSize, sortBy, sortDir, qName, qId } = opts;
  const params = {};
  if (page !== undefined) params.page = page;
  if (pageSize !== undefined) params.pageSize = pageSize;
  if (sortBy) params.sortBy = sortBy;
  if (sortDir) params.sortDir = sortDir;
  if (qName) params.qName = qName;
  if (qId) params.qId = qId;
  return params;
};

const normalizePaged = (resData) => Array.isArray(resData)
  ? { data: resData, page: 0, pageSize: resData.length, total: resData.length, totalPages: 1, hasNext: false, hasPrev: false }
  : resData;
