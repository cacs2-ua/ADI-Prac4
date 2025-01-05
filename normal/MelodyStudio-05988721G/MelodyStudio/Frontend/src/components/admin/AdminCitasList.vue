<!-- Frontend/src/components/admin/AdminCitasList.vue -->

<!-- 
Este archivo define un componente Vue.js llamado 'AdminCitasList', que se encarga de mostrar una lista de citas administrativas con funcionalidad de búsqueda, visualización de detalles y eliminación. Además, permite cargar más citas si hay páginas adicionales disponibles.
-->

<template>
  <div>
    <!-- Barra de búsqueda -->
    <div class="mb-3 d-flex" style="gap: 10px;">
      <input
        type="text"
        class="form-control"
        placeholder="Buscar cita por título..."
        v-model="searchQuery" 
        @keyup.enter="performSearch" 
      />
      <button class="btn btn-primary" @click="performSearch">Buscar</button> <!-- Botón para buscar -->
      <button class="btn btn-secondary" @click="clearSearch" v-if="searchQuery">Limpiar</button> <!-- Botón para limpiar búsqueda -->
    </div>
    <br>

    <!-- Tabla de citas -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Usuario</th>
          <th>Acciones</th> <!-- Columnas de la tabla -->
        </tr>
      </thead>
      <transition-group name="list" tag="tbody"> <!-- Animaciones al renderizar filas -->
        <tr v-for="cita in citas" :key="cita.id"> <!-- Itera sobre las citas disponibles -->
          <td>{{ cita.title }}</td> <!-- Muestra el título de la cita -->
          <td>{{ cita.description }}</td> <!-- Muestra la descripción -->
          <td>{{ formatDate(cita.date) }}</td> <!-- Formatea y muestra la fecha -->
          <td>{{ cita.time }}</td> <!-- Muestra la hora -->
          <td>{{ cita.userName }}</td> <!-- Muestra el nombre del usuario -->
          <td>
            <button class="btn btn-sm btn-info me-2" @click="viewCita(cita)">Ver</button> <!-- Botón para ver detalles -->
            <button class="btn btn-sm btn-danger" @click="deleteCita(cita.id)">Eliminar</button> <!-- Botón para eliminar -->
          </td>
        </tr>
      </transition-group>
    </table>

    <!-- Botón para cargar más citas -->
    <div class="text-center my-3" v-if="hasNextPage">
      <button class="btn btn-secondary" @click="loadMore">Cargar Más</button>
    </div>

    <!-- Modal de Detalles -->
    <b-modal v-model="showDetailsModal" title="Detalles de Cita" hide-footer>
      <p><strong>Título:</strong> {{ selectedCita.title }}</p>
      <p><strong>Descripción:</strong> {{ selectedCita.description }}</p>
      <p><strong>Fecha:</strong> {{ formatDate(selectedCita.date) }}</p>
      <p><strong>Hora:</strong> {{ selectedCita.time }}</p>
      <p><strong>Usuario:</strong> {{ selectedCita.userName }}</p>
    </b-modal>

    <!-- Modal de Confirmación de Eliminación -->
    <b-modal v-model="showDeleteModal" title="Confirmar Eliminación" hide-footer>
      <p>¿Estás seguro de eliminar esta cita?</p>
      <div class="text-end">
        <button class="btn btn-secondary me-2" @click="showDeleteModal = false">Cancelar</button>
        <button class="btn btn-danger" @click="confirmDelete">Eliminar</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useAdminCitasStore } from '../../stores/adminCitas'; // Store de citas administrativas
import { BModal } from 'bootstrap-vue-3';

export default {
  name: 'AdminCitasList',
  components: {
    BModal, // Modal de Bootstrap-Vue para manejar ventanas emergentes
  },
  setup() {
    // VARIABLES DEL ESTADO DEL COMPONENTE
    const adminCitasStore = useAdminCitasStore(); // Store para manejar citas y su estado global
    const searchQuery = ref(adminCitasStore.searchQuery); // Entrada de búsqueda
    const showDetailsModal = ref(false); // Controla la visibilidad del modal de detalles
    const showDeleteModal = ref(false); // Controla la visibilidad del modal de confirmación de eliminación
    const selectedCita = ref({}); // Cita seleccionada para ver detalles
    const citaToDelete = ref(null); // ID de la cita a eliminar

    // EVENTOS GENERADOS
    // - fetchCitas: Obtiene las citas iniciales.
    // - loadMore: Carga más citas si hay páginas disponibles.
    // - performSearch: Realiza una búsqueda de citas.
    // - clearSearch: Limpia los términos de búsqueda.
    // - viewCita: Abre el modal de detalles de una cita seleccionada.
    // - deleteCita: Muestra el modal de confirmación para eliminar una cita.
    // - confirmDelete: Elimina una cita confirmada.

    // FUNCIONES
    const fetchCitas = async () => {
      // Obtiene la primera página de citas, basado en el término de búsqueda
      await adminCitasStore.fetchFirstPage(5, searchQuery.value);
    };

    const loadMore = async () => {
      // Carga la siguiente página de citas
      await adminCitasStore.fetchNextPage(5, searchQuery.value);
    };

    const hasNextPage = computed(() => adminCitasStore.pagination.hasNextPage); // Verifica si hay más páginas

    const viewCita = (cita) => {
      // Establece la cita seleccionada y abre el modal de detalles
      selectedCita.value = cita;
      showDetailsModal.value = true;
    };

    const deleteCita = (id) => {
      // Guarda el ID de la cita a eliminar y muestra el modal de confirmación
      citaToDelete.value = id;
      showDeleteModal.value = true;
    };

    const confirmDelete = async () => {
      // Elimina la cita seleccionada del store y cierra el modal de confirmación
      if (citaToDelete.value) {
        try {
          await adminCitasStore.deleteCita(citaToDelete.value);
          showDeleteModal.value = false;
          citaToDelete.value = null;
        } catch (error) {
          console.error('Error al eliminar cita:', error);
        }
      }
    };

    const formatDate = (dateString) => {
      // Da formato a una fecha para ser más legible
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const performSearch = () => {
      // Establece el término de búsqueda y actualiza las citas mostradas
      adminCitasStore.setSearchQuery(searchQuery.value);
      fetchCitas();
    };

    const clearSearch = () => {
      // Limpia el término de búsqueda y actualiza las citas mostradas
      searchQuery.value = '';
      adminCitasStore.setSearchQuery('');
      fetchCitas();
    };

    onMounted(() => {
      // Llama a fetchCitas cuando el componente se monta
      fetchCitas();
    });

    return {
      citas: computed(() => adminCitasStore.citas), // Lista de citas obtenidas del store
      hasNextPage, // Estado si hay más páginas
      loadMore, // Método para cargar más citas
      viewCita, // Método para ver detalles de una cita
      deleteCita, // Método para solicitar eliminación de una cita
      showDetailsModal, // Estado del modal de detalles
      selectedCita, // Cita seleccionada para mostrar detalles
      showDeleteModal, // Estado del modal de confirmación de eliminación
      confirmDelete, // Método para confirmar eliminación
      formatDate, // Método para dar formato a fechas
      searchQuery, // Término de búsqueda
      performSearch, // Método para buscar citas
      clearSearch, // Método para limpiar búsqueda
    };
  },
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s; /* Transición al renderizar filas */
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px); /* Animación al entrar */
}
.list-leave-to {
  opacity: 0;
  transform: translateY(20px); /* Animación al salir */
}
</style>
