import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getBudgets = (token, month) =>
  axios.get(`${API_URL}/budgets/${month ? `?month=${month}` : ''}`, authHeader(token));

export const createBudget = (token, data) =>
  axios.post(`${API_URL}/budgets/`, data, authHeader(token));

export const updateBudget = (token, id, data) =>
  axios.put(`${API_URL}/budgets/${id}`, data, authHeader(token));

export const deleteBudget = (token, id) =>
  axios.delete(`${API_URL}/budgets/${id}`, authHeader(token));