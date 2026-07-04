import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getInsights = (token) =>
  axios.get(`${API_URL}/insights/`, {
    headers: { Authorization: `Bearer ${token}` },
  });