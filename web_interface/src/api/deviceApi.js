import axios from 'axios';
import { ESP32_BASE_URL } from './apiConfig';
import { BASE_URL } from './apiConfig';

// התחלת מדידה בבקר
export const startESP32Session = () => {
  return axios.get(`${BASE_URL}/device/start-session`);
};

// עצירת מדידה בבקר
export const stopESP32Session = () => {
  return axios.get(`${BASE_URL}/stop-session`);
};

// בדיקת מצב הבקר
export const getESP32Status = () => {
  return axios.get(`${BASE_URL}/status`);
};
