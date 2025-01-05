// stores/citas.js

/*
Este archivo define una store de Pinia para gestionar citas. 
Proporciona estado, acciones y funcionalidades para buscar, paginar, crear, actualizar y eliminar citas.
*/

import { defineStore } from 'pinia';
import apiClient from '../plugins/axios'; // Cliente HTTP para comunicarse con el backend

export const useCitasStore = defineStore('citas', {
  // Estado inicial de la store
  state: () => ({
    citas: [], // Lista de citas cargadas
    loading: false, // Indica si hay una operación en progreso
    error: null, // Almacena errores durante las operaciones
    pagination: {
      hasNextPage: false, // Indica si hay más páginas disponibles
      nextPageToken: null, // Token para la siguiente página
      totalItems: 0, // Total de citas disponibles
      totalPages: 1, // Total de páginas calculadas
    },
    searchQuery: '', // Texto de búsqueda ingresado por el usuario
  }),

  // Acciones: métodos que permiten modificar el estado y realizar operaciones
  actions: {
    /**
     * setSearchQuery
     * Actualiza el término de búsqueda en el estado.
     * @param {string} query - Texto ingresado por el usuario.
     */
    setSearchQuery(query) {
      this.searchQuery = query; // Actualiza el término de búsqueda
    },

    /**
     * fetchFirstPage
     * Obtiene la primera página de citas desde el servidor, con opción de búsqueda.
     * @param {number} [limit=3] - Número de citas por página.
     * @param {string} [search=''] - Filtro de búsqueda.
     */
    async fetchFirstPage(limit = 3, search = '') {
      this.loading = true; // Activa el indicador de carga
      try {
        const params = { limit }; // Parámetros básicos de la petición
        if (search && search.trim() !== '') {
          params.search = search.trim(); // Agrega el término de búsqueda si existe
        }
        const response = await apiClient.get('/appointments', { params }); // Petición al backend
        this.citas = response.data.citas || []; // Almacena las citas obtenidas
        this.pagination.hasNextPage = response.data.hasNextPage || false; // Actualiza si hay más páginas
        this.pagination.nextPageToken = response.data.nextPageToken || null; // Token para la siguiente página
        this.pagination.totalItems = response.data.totalItems || 0; // Total de citas disponibles
        this.pagination.totalPages = response.data.totalPages || 1; // Total de páginas calculadas
        this.error = null; // Resetea los errores
      } catch (error) {
        console.error('Error al obtener citas:', error);
        this.error = error.response?.data?.error || 'Error al obtener citas'; // Almacena el error
      } finally {
        this.loading = false; // Finaliza el indicador de carga
      }
    },

    /**
     * fetchNextPage
     * Obtiene la siguiente página de citas desde el servidor.
     * @param {number} [limit=3] - Número de citas por página.
     * @param {string} [search=''] - Filtro de búsqueda.
     */
    async fetchNextPage(limit = 3, search = '') {
      if (!this.pagination.hasNextPage || !this.pagination.nextPageToken) return; // Evita peticiones innecesarias
      this.loading = true; // Activa el indicador de carga
      try {
        const params = {
          limit,
          pageToken: this.pagination.nextPageToken, // Token para obtener la siguiente página
        };
        if (search && search.trim() !== '') {
          params.search = search.trim(); // Agrega el término de búsqueda si existe
        }
        const response = await apiClient.get('/appointments', { params }); // Petición al backend
        const newCitas = response.data.citas || []; // Nuevas citas obtenidas
        this.citas = [...this.citas, ...newCitas]; // Añade las nuevas citas a la lista existente
        this.pagination.hasNextPage = response.data.hasNextPage || false; // Actualiza si hay más páginas
        this.pagination.nextPageToken = response.data.nextPageToken || null; // Nuevo token para la siguiente página
        this.pagination.totalItems = response.data.totalItems || this.pagination.totalItems; // Actualiza el total de citas
        this.pagination.totalPages = response.data.totalPages || this.pagination.totalPages; // Actualiza el total de páginas
        this.error = null; // Resetea los errores
      } catch (error) {
        console.error('Error al obtener la siguiente página de citas:', error);
        this.error = error.response?.data?.error || 'Error al obtener citas'; // Almacena el error
      } finally {
        this.loading = false; // Finaliza el indicador de carga
      }
    },

    /**
     * createCita
     * Crea una nueva cita en el servidor.
     * @param {Object} appointmentData - Datos de la nueva cita.
     * @throws {Error} - Si ocurre un error durante la creación.
     */
    async createCita(appointmentData) {
      try {
        const response = await apiClient.post('/appointments', appointmentData); // Petición para crear una cita
        this.citas.unshift(response.data); // Añade la nueva cita al principio de la lista
        this.pagination.totalItems += 1; // Incrementa el total de citas
      } catch (error) {
        console.error('Error al crear cita:', error);
        this.error = error.response?.data?.error || 'Error al crear cita'; // Almacena el error
        throw error; // Lanza el error para manejo externo
      }
    },

    /**
     * updateCita
     * Actualiza una cita existente en el servidor.
     * @param {number} id - ID de la cita a actualizar.
     * @param {Object} updatedData - Nuevos datos para la cita.
     * @throws {Error} - Si ocurre un error durante la actualización.
     */
    async updateCita(id, updatedData) {
      try {
        const response = await apiClient.put(`/appointments/${id}`, updatedData); // Petición para actualizar la cita
        const index = this.citas.findIndex((cita) => cita.id === id); // Encuentra el índice de la cita en la lista
        if (index !== -1) {
          this.citas[index] = response.data; // Actualiza los datos de la cita
        }
      } catch (error) {
        console.error('Error al actualizar cita:', error);
        this.error = error.response?.data?.error || 'Error al actualizar cita'; // Almacena el error
        throw error; // Lanza el error para manejo externo
      }
    },

    /**
     * deleteCita
     * Elimina una cita existente en el servidor.
     * @param {number} id - ID de la cita a eliminar.
     * @throws {Error} - Si ocurre un error durante la eliminación.
     */
    async deleteCita(id) {
      try {
        await apiClient.delete(`/appointments/${id}`); // Petición para eliminar la cita
        this.citas = this.citas.filter((cita) => cita.id !== id); // Filtra y elimina la cita del estado
        this.pagination.totalItems -= 1; // Decrementa el total de citas
      } catch (error) {
        console.error('Error al eliminar cita:', error);
        this.error = error.response?.data?.error || 'Error al eliminar cita'; // Almacena el error
        throw error; // Lanza el error para manejo externo
      }
    },
  },
});
