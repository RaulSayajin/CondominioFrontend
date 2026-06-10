import axios from 'axios';

const api = axios.create({
  baseURL: 'https://condominiobackend.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CondominioMaster:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;