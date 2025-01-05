// Frontend/src/stores/adminIncidencias.js

/*
Este archivo define una store de Pinia para gestionar las incidencias desde el panel de administrador.
Proporciona estado, acciones y funcionalidades para buscar, paginar y eliminar incidencias.
*/

import { defineStore } from 'pinia';
import apiClient from '../plugins/axios'; // Cliente HTTP para realizar las peticiones al backend

export const useAdminIncidenciasStore = defineStore('adminIncidencias', {
  // Estado inicial de la store
  state: () => ({
    incidencias: [], // Lista de incidencias cargadas
    loading: false, // Indica si hay una operación en progreso
    error: null, // Almacena mensajes de error si ocurren
    pagination: {
      hasNextPage: false, // Indica si hay más páginas disponibles
      nextPageToken: null, // Token para obtener la siguiente página
    },
    searchQuery: '', // Texto de búsqueda ingresado por el usuario
  }),

  // Acciones que permiten modificar el estado o realizar operaciones
  actions: {
    /**
     * setSearchQuery
     * Actualiza el texto de búsqueda en el estado.
     * @param {string} query - Texto ingresado por el usuario.
     */
    setSearchQuery(query) {
      this.searchQuery = query; // Establece el nuevo texto de búsqueda
    },

    /**
     * fetchFirstPage
     * Obtiene la primera página de incidencias desde el servidor.
     * @param {number} [limit=10] - Número de incidencias por página.
     * @param {string} [search=''] - Filtro de búsqueda.
     */
    async fetchFirstPage(limit = 10, search = '') {
      this.loading = true; // Activa el estado de carga
      try {
        const params = { limit }; // Parámetros básicos de la petición
        if (search && search.trim() !== '') {
          params.search = search.trim(); // Agrega el filtro de búsqueda si existe
        }
        const response = await apiClient.get('/admin/incidencias', { params }); // Petición al backend
        this.incidencias = response.data.incidencias || []; // Almacena las incidencias obtenidas
        this.pagination.hasNextPage = response.data.hasNextPage || false; // Actualiza el estado de paginación
        this.pagination.nextPageToken = response.data.nextPageToken || null; // Guarda el token para la siguiente página
        this.error = null; // Resetea los errores
      } catch (error) {
        console.error('Error al obtener incidencias de administrador:', error);
        this.error = error.response?.data?.error || 'Error al obtener incidencias'; // Almacena el error
      } finally {
        this.loading = false; // Finaliza el estado de carga
      }
    },

    /**
     * fetchNextPage
     * Obtiene la siguiente página de incidencias.
     * @param {number} [limit=10] - Número de incidencias por página.
     * @param {string} [search=''] - Filtro de búsqueda.
     */
    async fetchNextPage(limit = 10, search = '') {
      if (!this.pagination.hasNextPage || !this.pagination.nextPageToken) return; // No realiza la petición si no hay más páginas
      this.loading = true; // Activa el estado de carga
      try {
        const params = {
          limit,
          pageToken: this.pagination.nextPageToken, // Usa el token para obtener la siguiente página
        };
        if (search && search.trim() !== '') {
          params.search = search.trim(); // Agrega el filtro de búsqueda si existe
        }

        const response = await apiClient.get('/admin/incidencias', { params }); // Petición al backend
        const newIncidencias = response.data.incidencias || []; // Obtiene las nuevas incidencias
        this.incidencias = [...this.incidencias, ...newIncidencias]; // Añade las nuevas incidencias a la lista actual
        this.pagination.hasNextPage = response.data.hasNextPage || false; // Actualiza si hay más páginas
        this.pagination.nextPageToken = response.data.nextPageToken || null; // Guarda el nuevo token
        this.error = null; // Resetea los errores
      } catch (error) {
        console.error('Error al obtener la siguiente página de incidencias:', error);
        this.error = error.response?.data?.error || 'Error al obtener incidencias'; // Almacena el error
      } finally {
        this.loading = false; // Finaliza el estado de carga
      }
    },

    /**
     * deleteIncidencia
     * Elimina una incidencia por su ID.
     * @param {number} id - ID de la incidencia a eliminar.
     */
    async deleteIncidencia(id) {
      try {
        await apiClient.delete(`/admin/incidencias/${id}`); // Petición para eliminar la incidencia
        this.incidencias = this.incidencias.filter((inc) => inc.id !== id); // Filtra las incidencias y elimina la que coincide con el ID
      } catch (error) {
        console.error('Error al eliminar incidencia de administrador:', error);
        this.error = error.response?.data?.error || 'Error al eliminar incidencia'; // Almacena el error
        throw error; // Lanza el error para que sea manejado externamente
      }
    },
  },
});
