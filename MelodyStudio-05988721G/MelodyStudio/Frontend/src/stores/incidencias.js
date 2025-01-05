// stores/incidencias.js

/*
Este archivo define una store de Pinia para gestionar incidencias. 
Proporciona estado, acciones y funcionalidades para buscar, paginar, crear, actualizar y eliminar incidencias.
*/

import { defineStore } from 'pinia';
import apiClient from '../plugins/axios'; // Cliente HTTP para realizar peticiones al backend

export const useIncidenciasStore = defineStore('incidencias', {
  // Estado inicial de la store
  state: () => ({
    incidencias: [], // Lista de incidencias cargadas
    loading: false, // Indica si hay una operación en progreso
    error: null, // Almacena errores durante las operaciones
    pagination: {
      totalPages: 1, // Total de páginas disponibles
      totalItems: 0, // Total de incidencias registradas
      hasNextPage: false, // Indica si hay más páginas disponibles
      nextPageToken: null, // Token para la siguiente página
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
     * Obtiene la primera página de incidencias desde el servidor, con opción de búsqueda.
     * @param {number} [limit=3] - Número de incidencias por página.
     * @param {string} [search=''] - Filtro de búsqueda.
     */
    async fetchFirstPage(limit = 3, search = '') {
      this.loading = true; // Activa el indicador de carga
      try {
        const params = { limit }; // Parámetros básicos de la petición
        if (search && search.trim() !== '') {
          params.search = search.trim(); // Agrega el término de búsqueda si existe
        }
        const response = await apiClient.get('/incidencias', { params }); // Petición al backend
        this.incidencias = response.data.incidencias || []; // Almacena las incidencias obtenidas
        this.pagination.totalPages = response.data.totalPages || 1; // Total de páginas disponibles
        this.pagination.totalItems = response.data.totalItems || 0; // Total de incidencias registradas
        this.pagination.hasNextPage = response.data.hasNextPage || false; // Indica si hay más páginas
        this.pagination.nextPageToken = response.data.nextPageToken || null; // Token para la siguiente página
        this.error = null; // Resetea los errores
      } catch (error) {
        console.error('Error al obtener incidencias:', error);
        this.error = error.response?.data?.error || 'Error al obtener incidencias'; // Almacena el error
      } finally {
        this.loading = false; // Finaliza el indicador de carga
      }
    },

    /**
     * fetchNextPage
     * Obtiene la siguiente página de incidencias desde el servidor.
     * @param {number} [limit=3] - Número de incidencias por página.
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
        const response = await apiClient.get('/incidencias', { params }); // Petición al backend
        const newIncidencias = response.data.incidencias || []; // Nuevas incidencias obtenidas
        this.incidencias = [...this.incidencias, ...newIncidencias]; // Añade las nuevas incidencias a la lista existente
        this.pagination.hasNextPage = response.data.hasNextPage || false; // Indica si hay más páginas
        this.pagination.nextPageToken = response.data.nextPageToken || null; // Token para la siguiente página
        this.pagination.totalPages = response.data.totalPages || this.pagination.totalPages; // Actualiza el total de páginas
        this.pagination.totalItems = response.data.totalItems || this.pagination.totalItems; // Actualiza el total de incidencias
        this.error = null; // Resetea los errores
      } catch (error) {
        console.error('Error al obtener la siguiente página de incidencias:', error);
        this.error = error.response?.data?.error || 'Error al obtener incidencias'; // Almacena el error
      } finally {
        this.loading = false; // Finaliza el indicador de carga
      }
    },

    /**
     * createIncidencia
     * Crea una nueva incidencia en el servidor.
     * @param {string} title - Título de la incidencia.
     * @param {string} description - Descripción de la incidencia.
     * @throws {Error} - Si ocurre un error durante la creación.
     */
    async createIncidencia(title, description) {
      try {
        const response = await apiClient.post('/incidencias', { title, description }); // Petición para crear una incidencia
        this.incidencias.unshift(response.data); // Añade la nueva incidencia al principio de la lista
        this.pagination.totalItems += 1; // Incrementa el total de incidencias
      } catch (error) {
        console.error('Error al crear incidencia:', error);
        this.error = error.response?.data?.error || 'Error al crear incidencia'; // Almacena el error
        throw error; // Lanza el error para manejo externo
      }
    },

    /**
     * updateIncidencia
     * Actualiza una incidencia existente en el servidor.
     * @param {number} id - ID de la incidencia a actualizar.
     * @param {Object} updatedData - Nuevos datos para la incidencia.
     * @throws {Error} - Si ocurre un error durante la actualización.
     */
    async updateIncidencia(id, updatedData) {
      try {
        const response = await apiClient.put(`/incidencias/${id}`, updatedData); // Petición para actualizar la incidencia
        const index = this.incidencias.findIndex((inc) => inc.id === id); // Encuentra el índice de la incidencia en la lista
        if (index !== -1) {
          this.incidencias[index] = response.data; // Actualiza los datos de la incidencia
        }
      } catch (error) {
        console.error('Error al actualizar incidencia:', error);
        this.error = error.response?.data?.error || 'Error al actualizar incidencia'; // Almacena el error
        throw error; // Lanza el error para manejo externo
      }
    },

    /**
     * deleteIncidencia
     * Elimina una incidencia existente en el servidor.
     * @param {number} id - ID de la incidencia a eliminar.
     * @throws {Error} - Si ocurre un error durante la eliminación.
     */
    async deleteIncidencia(id) {
      try {
        await apiClient.delete(`/incidencias/${id}`); // Petición para eliminar la incidencia
        this.incidencias = this.incidencias.filter((inc) => inc.id !== id); // Filtra y elimina la incidencia del estado
        this.pagination.totalItems -= 1; // Decrementa el total de incidencias
      } catch (error) {
        console.error('Error al eliminar incidencia:', error);
        this.error = error.response?.data?.error || 'Error al eliminar incidencia'; // Almacena el error
        throw error; // Lanza el error para manejo externo
      }
    },
  },
});
