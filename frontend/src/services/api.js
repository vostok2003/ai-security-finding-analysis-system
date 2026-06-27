import axios from 'axios';

const api = axios.create({
  // If in production, use VITE_API_URL, else empty string which triggers the Vite server proxy
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 35000, // 35 seconds to allow Groq model inference and storage processes
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeFinding = async (findingData) => {
  const response = await api.post('/api/v1/analyze', findingData);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/api/v1/history');
  return response.data;
};

export const deleteHistory = async (id) => {
  const response = await api.delete(`/api/v1/history/${id}`);
  return response.data;
};

export default api;
