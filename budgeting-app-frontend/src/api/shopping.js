import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createShoppingList = (token, data) =>
  axios.post(`${API_URL}/shopping-lists/`, data, authHeader(token));

export const optimizeShoppingList = (token, listId) =>
  axios.get(`${API_URL}/shopping-lists/${listId}/optimize`, authHeader(token));