import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const signup = (email, password) =>
  axios.post(`${API_URL}/auth/signup`, { email, password });

export const login = (email, password) =>
  axios.post(`${API_URL}/auth/login`, { email, password });

export const getMe = async (token) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};