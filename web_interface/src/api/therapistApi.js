import axios from 'axios';
import { BASE_URL } from './apiConfig';

// Function to register a therapist
export const registerTherapist = (email, password, name) => {
  return axios.post(`${BASE_URL}/therapists/register`, { email, password,name });
};

// Function to login a therapist
export const loginTherapist = (email, password) => {
  return axios.post(`${BASE_URL}/therapists/login`, { email, password });
};
