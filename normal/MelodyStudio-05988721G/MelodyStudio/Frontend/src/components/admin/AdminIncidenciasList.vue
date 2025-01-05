<!-- Frontend/src/components/admin/AdminIncidenciasList.vue -->

<!--
This file defines the `AdminIncidenciasList` Vue.js component, which provides functionality for managing a list of reported incidents. 
Features include searching incidents by title, viewing detailed information, deleting incidents, and loading additional pages if more incidents exist.
-->

<template>
  <div>
    <!-- Search bar for incidents -->
    <div class="mb-3 d-flex" style="gap: 10px;">
      <input
        type="text"
        class="form-control"
        placeholder="Buscar incidencia por título..." 
        v-model="searchQuery" 
        @keyup.enter="performSearch" 
      />
      <button class="btn btn-primary" @click="performSearch">Buscar</button> <!-- Button to trigger a search -->
      <button class="btn btn-secondary" @click="clearSearch" v-if="searchQuery">Limpiar</button> <!-- Button to clear the search -->
    </div>

    <!-- Table displaying the incidents -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Título</th> <!-- Incident title -->
          <th>Descripción</th> <!-- Incident description -->
          <th>Fecha de Creación</th> <!-- Creation date -->
          <th>Usuario</th> <!-- User who reported the incident -->
          <th>Acciones</th> <!-- Actions column -->
        </tr>
      </thead>
      <transition-group name="list" tag="tbody"> <!-- Animations for list changes -->
        <tr v-for="incidencia in incidencias" :key="incidencia.id"> <!-- Iterates over incidents -->
          <td>{{ incidencia.title }}</td> <!-- Displays incident title -->
          <td>{{ incidencia.description }}</td> <!-- Displays incident description -->
          <td>{{ formatDate(incidencia.createdAt) }}</td> <!-- Formats and displays creation date -->
          <td>{{ incidencia.userName }}</td> <!-- Displays user name -->
          <td>
            <button class="btn btn-sm btn-info me-2" @click="viewIncidencia(incidencia)">Ver</button> <!-- Button to view details -->
            <button class="btn btn-sm btn-danger" @click="deleteIncidencia(incidencia.id)">Eliminar</button> <!-- Button to delete the incident -->
          </td>
        </tr>
      </transition-group>
    </table>

    <!-- Button to load more incidents -->
    <div class="text-center my-3" v-if="hasNextPage">
      <button class="btn btn-secondary" @click="loadMore">Cargar Más</button>
    </div>

    <!-- Modal for incident details -->
    <b-modal v-model="showDetailsModal" title="Detalles de Incidencia" hide-footer>
      <p><strong>Título:</strong> {{ selectedIncidencia.title }}</p> <!-- Incident title -->
      <p><strong>Descripción:</strong> {{ selectedIncidencia.description }}</p> <!-- Incident description -->
      <p><strong>Creado el:</strong> {{ formatDate(selectedIncidencia.createdAt) }}</p> <!-- Incident creation date -->
      <p><strong>Usuario:</strong> {{ selectedIncidencia.userName }}</p> <!-- User name -->
    </b-modal>

    <!-- Modal for delete confirmation -->
    <b-modal v-model="showDeleteModal" title="Confirmar Eliminación" hide-footer>
      <p>¿Estás seguro de eliminar esta incidencia?</p>
      <div class="text-end">
        <button class="btn btn-secondary me-2" @click="showDeleteModal = false">Cancelar</button> <!-- Button to cancel deletion -->
        <button class="btn btn-danger" @click="confirmDelete">Eliminar</button> <!-- Button to confirm deletion -->
      </div>
    </b-modal>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useAdminIncidenciasStore } from '../../stores/adminIncidencias'; // Store for managing incidents
import { BModal } from 'bootstrap-vue-3';

export default {
  name: 'AdminIncidenciasList',
  components: {
    BModal, // Modal component from Bootstrap-Vue
  },
  setup() {
    // STATE VARIABLES
    const adminIncidenciasStore = useAdminIncidenciasStore(); // Store for fetching, updating, and deleting incidents
    const searchQuery = ref(adminIncidenciasStore.searchQuery); // Input value for search queries
    const showDetailsModal = ref(false); // Controls visibility of the details modal
    const showDeleteModal = ref(false); // Controls visibility of the delete confirmation modal
    const selectedIncidencia = ref({}); // Stores the currently selected incident for viewing
    const incidenciaToDelete = ref(null); // Stores the ID of the incident to be deleted

    // EVENTS GENERATED
    // - fetchIncidencias: Fetches the initial page of incidents.
    // - loadMore: Loads the next page of incidents if available.
    // - performSearch: Executes a search based on the `searchQuery`.
    // - clearSearch: Clears the search query and refreshes the incident list.
    // - viewIncidencia: Displays the modal with detailed information about a selected incident.
    // - deleteIncidencia: Opens the confirmation modal to delete a specific incident.
    // - confirmDelete: Confirms and deletes the selected incident.

    // METHODS
    const fetchIncidencias = async () => {
      // Fetches the first page of incidents, considering the search query
      await adminIncidenciasStore.fetchFirstPage(5, searchQuery.value);
    };

    const loadMore = async () => {
      // Fetches the next page of incidents
      await adminIncidenciasStore.fetchNextPage(5, searchQuery.value);
    };

    const hasNextPage = computed(() => adminIncidenciasStore.pagination.hasNextPage); // Determines if there are more pages

    const viewIncidencia = (incidencia) => {
      // Sets the selected incident and opens the details modal
      selectedIncidencia.value = incidencia;
      showDetailsModal.value = true;
    };

    const deleteIncidencia = (id) => {
      // Sets the ID of the incident to be deleted and opens the confirmation modal
      incidenciaToDelete.value = id;
      showDeleteModal.value = true;
    };

    const confirmDelete = async () => {
      // Deletes the selected incident and closes the confirmation modal
      if (incidenciaToDelete.value) {
        try {
          await adminIncidenciasStore.deleteIncidencia(incidenciaToDelete.value);
          showDeleteModal.value = false;
          incidenciaToDelete.value = null;
        } catch (error) {
          console.error('Error al eliminar incidencia:', error);
        }
      }
    };

    const formatDate = (dateString) => {
      // Formats a date string into a readable format
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const performSearch = () => {
      // Sets the search query and refreshes the incident list
      adminIncidenciasStore.setSearchQuery(searchQuery.value);
      fetchIncidencias();
    };

    const clearSearch = () => {
      // Clears the search query and refreshes the incident list
      searchQuery.value = '';
      adminIncidenciasStore.setSearchQuery('');
      fetchIncidencias();
    };

    onMounted(() => {
      // Fetches the initial set of incidents when the component is mounted
      fetchIncidencias();
    });

    return {
      incidencias: computed(() => adminIncidenciasStore.incidencias), // List of incidents fetched from the store
      hasNextPage, // Indicates if more incidents can be loaded
      loadMore, // Loads more incidents
      viewIncidencia, // Views detailed information of an incident
      deleteIncidencia, // Prepares the deletion of an incident
      showDetailsModal, // Controls the details modal visibility
      selectedIncidencia, // Stores the currently selected incident for viewing
      showDeleteModal, // Controls the delete confirmation modal visibility
      confirmDelete, // Confirms and deletes an incident
      formatDate, // Formats date strings
      searchQuery, // Stores the current search query
      performSearch, // Executes a search
      clearSearch, // Clears the search query
    };
  },
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s; /* Smooth transition for list animations */
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px); /* Enter animation */
}
.list-leave-to {
  opacity: 0;
  transform: translateY(20px); /* Leave animation */
}
</style>
