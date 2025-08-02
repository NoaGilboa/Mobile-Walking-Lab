import axios from 'axios';
import { BASE_URL } from './apiConfig';

export const setESP32Command = (command, patientId) => {
  return axios.post(`${BASE_URL}/device/command`, { command, patientId });
};

//get all measurements from db
export const getDeviceMeasurements = (userId) => {
  return axios.get(`${BASE_URL}/device/${userId}/measurements`);
};

// Get video by measurement ID
export const getVideoByMeasurementId = (measurementId) => {
  return axios.get(`${BASE_URL}/video/by-measurement/${measurementId}`);
};
