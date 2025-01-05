// src/services/api.js

import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: 'http://localhost:5000', // Cambia esto si tu backend está en otra URL
});

// Interceptor para agregar el token de autenticación a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('idToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para manejar errores globalmente (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Puedes manejar errores globales aquí
    return Promise.reject(error);
  }
);

export default api;
