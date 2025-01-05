// Frontend/src/stores/auth.js

/*
Este archivo define una store con Pinia para gestionar la autenticación de usuarios.
Proporciona estado, getters y acciones para iniciar sesión, registrar usuarios, cerrar sesión y obtener datos del usuario autenticado.
*/

import { defineStore } from 'pinia';
import apiClient from '../plugins/axios'; // Cliente HTTP para realizar peticiones al backend
import router from '../router'; // Router para manejar redirecciones

export const useAuthStore = defineStore('auth', {
  // Estado inicial de la store
  state: () => ({
    user: null, // Información del usuario autenticado
    token: localStorage.getItem('token') || '', // Token de autenticación almacenado en el localStorage
    error: null, // Para manejar errores relacionados con la autenticación
  }),

  // Getters: funciones derivadas para acceder a datos del estado
  getters: {
    /**
     * isAuthenticated
     * Verifica si el usuario está autenticado.
     * @param {Object} state - Estado actual de la store.
     * @returns {boolean} - `true` si hay un token válido, `false` de lo contrario.
     */
    isAuthenticated: (state) => !!state.token,
  },

  // Acciones: métodos para modificar el estado o realizar operaciones asincrónicas
  actions: {
    /**
     * login
     * Maneja el inicio de sesión del usuario.
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @throws {Error} - Si ocurre un error durante el inicio de sesión.
     */
    async login(email, password) {
      try {
        const response = await apiClient.post('/auth/login', {
          email,
          password,
        });

        // Almacenar el token en el estado y localStorage
        this.token = response.data.idToken;
        localStorage.setItem('token', this.token);

        // Configurar el estado del usuario
        this.user = {
          role: response.data.role, // Rol del usuario (admin, musician, client, etc.)
          email: response.data.email, // Email del usuario
          displayName: response.data.displayName || response.data.email.split('@')[0], // Nombre para mostrar
        };

        this.error = null; // Limpiar errores previos

        // Redirigir al dashboard correspondiente según el rol del usuario
        if (this.user.role === 'admin') {
          router.push({ name: 'AdminDashboard' });
        } else if (this.user.role === 'musician') {
          router.push({ name: 'MusicianDashboard' });
        } else if (this.user.role === 'client') {
          router.push({ name: 'ClientDashboard' });
        } else {
          router.push({ name: 'Home' }); // Redirige a la página de inicio si no tiene rol definido
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Error de autenticación'; // Almacenar el error
        throw error; // Lanza el error para manejo externo
      }
    },

    /**
     * logout
     * Maneja el cierre de sesión del usuario.
     * Elimina el token y los datos del usuario del estado y redirige al login.
     */
    logout() {
      this.token = ''; // Limpia el token del estado
      this.user = null; // Limpia los datos del usuario
      localStorage.removeItem('token'); // Elimina el token del localStorage
      router.push({ name: 'Login' }); // Redirige a la página de inicio de sesión
    },

    /**
     * register
     * Maneja el registro de un nuevo usuario cliente.
     * @param {string} email - Correo electrónico del nuevo usuario.
     * @param {string} password - Contraseña del nuevo usuario.
     * @param {string} username - Nombre de usuario para mostrar.
     * @throws {Error} - Si ocurre un error durante el registro.
     */
    async register(email, password, username) {
      try {
        await apiClient.post('/auth/signup-client', {
          email,
          password,
          displayName: username,
        });

        // Redirige al login después del registro exitoso
        router.push({ name: 'Login' });
      } catch (error) {
        this.error = error.response?.data?.error || 'Error en el registro'; // Almacena el error
        throw error; // Lanza el error para manejo externo
      }
    },

    /**
     * fetchUser
     * Obtiene la información del usuario autenticado si existe un token válido.
     * Si ocurre un error, cierra la sesión.
     */
    async fetchUser() {
      if (this.token) {
        try {
          const response = await apiClient.get('/auth/protected'); // Petición para obtener información del usuario
          this.user = response.data.user; // Almacena los datos del usuario
        } catch (error) {
          console.error('Error al fetchUser:', error);
          this.logout(); // Cierra la sesión en caso de error
        }
      }
    },
  },

  // Persistencia: guarda automáticamente el estado en localStorage
  persist: {
    enabled: true, // Activa la persistencia
    strategies: [
      {
        key: 'auth', // Clave para guardar el estado en el localStorage
        storage: localStorage,
      },
    ],
  },
});
