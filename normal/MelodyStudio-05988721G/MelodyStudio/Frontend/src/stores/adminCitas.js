// Frontend/src/stores/adminCitas.js

/*
Este archivo define una store con Pinia para gestionar las citas desde el panel de administrador.
Proporciona estado, acciones y funcionalidades para buscar, paginar y eliminar citas de manera centralizada.
*/

import { defineStore } from 'pinia';
import apiClient from '../plugins/axios'; // Cliente HTTP para realizar peticiones al backend

export const useAdminCitasStore = defineStore('adminCitas', {
  // Estado inicial de la store
  state: () => ({
    citas: [], // Lista de citas cargadas
    loading: false, // Estado de carga
    error: null, // Almacena errores ocurridos durante las peticiones
    pagination: {
      hasNextPage: false, // Indica si hay más páginas disponibles
      nextPageToken: null, // Token para obtener la siguiente página
    },
    searchQuery: '', // Texto de búsqueda
  }),

  // Acciones que permiten modificar el estado o realizar operaciones
  actions: {
    /**
     * setSearchQuery
     * Actualiza el texto de búsqueda en el estado.
     * @param {string} query - Texto ingresado para la búsqueda.
     */
    setSearchQuery(query) {
      this.searchQuery = query; // Actualiza la búsqueda en el estado
    },

    /**
     * fetchFirstPage
     * Obtiene la primera página de citas desde el servidor.
     * @param {number} [limit=10] - Cantidad de citas por página.
     * @param {string} [search=''] - Filtro de búsqueda.
     */
    async fetchFirstPage(limit = 10, search = '') {
      this.loading = true; // Activa el estado de carga
      try {
        const params = { limit }; // Parámetros de la petición
        if (search && search.trim() !== '') {
          params.search = search.trim(); // Agrega el filtro de búsqueda si existe
        }
        const response = await apiClient.get('/admin/appointments', { params }); // Petición al endpoint de citas
        this.citas = response.data.citas || []; // Almacena las citas obtenidas
        this.pagination.hasNextPage = response.data.hasNextPage || false; // Indica si hay más páginas
        this.pagination.nextPageToken = response.data.nextPageToken || null; // Almacena el token de la siguiente página
        this.error = null; // Reinicia el error
      } catch (error) {
        console.error('Error al obtener citas de administrador:', error);
        this.error = error.response?.data?.error || 'Error al obtener citas'; // Almacena el error
      } finally {
        this.loading = false; // Desactiva el estado de carga
      }
    },

    /**
     * fetchNextPage
     * Obtiene la siguiente página de citas.
     * @param {number} [limit=10] - Cantidad de citas por página.
     * @param {string} [search=''] - Filtro de búsqueda.
     */
    async fetchNextPage(limit = 10, search = '') {
      if (!this.pagination.hasNextPage || !this.pagination.nextPageToken) return; // No realiza la petición si no hay más páginas
      this.loading = true;
      try {
        const params = {
          limit,
          pageToken: this.pagination.nextPageToken, // Usa el token para obtener la siguiente página
        };
        if (search && search.trim() !== '') {
          params.search = search.trim(); // Agrega el filtro de búsqueda si existe
        }

        const response = await apiClient.get('/admin/appointments', { params });
        const newCitas = response.data.citas || []; // Obtiene las nuevas citas
        this.citas = [...this.citas, ...newCitas]; // Añade las nuevas citas a la lista actual
        this.pagination.hasNextPage = response.data.hasNextPage || false; // Actualiza si hay más páginas
        this.pagination.nextPageToken = response.data.nextPageToken || null; // Almacena el nuevo token
        this.error = null;
      } catch (error) {
        console.error('Error al obtener la siguiente página de citas:', error);
        this.error = error.response?.data?.error || 'Error al obtener citas'; // Almacena el error
      } finally {
        this.loading = false; // Desactiva el estado de carga
      }
    },

    /**
     * deleteCita
     * Elimina una cita por su ID.
     * @param {number} id - ID de la cita a eliminar.
     */
    async deleteCita(id) {
      try {
        await apiClient.delete(`/admin/appointments/${id}`); // Petición para eliminar la cita
        this.citas = this.citas.filter((cita) => cita.id !== id); // Elimina la cita del estado local
      } catch (error) {
        console.error('Error al eliminar cita de administrador:', error);
        this.error = error.response?.data?.error || 'Error al eliminar cita'; // Almacena el error
        throw error; // Lanza el error para que sea manejado externamente
      }
    },
  },
});
