import axios from 'axios';
import { BASE_URL } from './apiConfig';

export const setESP32Command = (command) => {
  return axios.post(`${BASE_URL}/device/command`, { command });
};

