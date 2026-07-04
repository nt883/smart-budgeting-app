import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getDashboardSummary = (token, month) =>
  axios.get(`${API_URL}/dashboard/summary${month ? `?month=${month}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });