// Frontend/src/plugins/axios.js

import axios from 'axios';

// Crear una instancia de Axios con la configuración base
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Ajusta la URL si es necesario
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada solicitud si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
