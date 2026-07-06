import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const deleteAccount = (token) =>
  axios.delete(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });