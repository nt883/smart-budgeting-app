import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getGoals = (token) =>
  axios.get(`${API_URL}/goals/`, authHeader(token));

export const createGoal = (token, data) =>
  axios.post(`${API_URL}/goals/`, data, authHeader(token));

export const addSavings = (token, id, amount) =>
  axios.put(`${API_URL}/goals/${id}/add-savings`, { amount_to_add: amount }, authHeader(token));

export const deleteGoal = (token, id) =>
  axios.delete(`${API_URL}/goals/${id}`, authHeader(token));

export const affordCheck = (token, itemCost) =>
  axios.get(`${API_URL}/goals/afford-check?item_cost=${itemCost}`, authHeader(token));