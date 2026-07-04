import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getTransactions = (token) =>
  axios.get(`${API_URL}/transactions/`, authHeader(token));

export const createTransaction = (token, data) =>
  axios.post(`${API_URL}/transactions/`, data, authHeader(token));

export const updateTransaction = (token, id, data) =>
  axios.put(`${API_URL}/transactions/${id}`, data, authHeader(token));

export const deleteTransaction = (token, id) =>
  axios.delete(`${API_URL}/transactions/${id}`, authHeader(token));

export const importCsv = (token, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/transactions/import-csv`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};