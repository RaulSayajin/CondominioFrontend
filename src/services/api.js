import axios from 'axios';

const api = axios.create({
  // Define o endereço do backend (Render ou Localhost)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
});

// Interceptor para injetar o Token JWT em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CondominioMaster:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;