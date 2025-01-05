<!-- components/citas/CitasList.vue -->

<!-- 
Este archivo define un componente Vue.js llamado `CitasList`, diseñado para gestionar citas del usuario.
El componente permite listar, buscar, crear, editar y eliminar citas, con una interfaz interactiva que incluye
formularios modales para crear/editar citas y una tabla para visualizar las citas existentes.
-->

<template>
  <div>
    <h4>Mis Citas</h4>
    <br />
    <div class="mb-3 d-flex" style="gap: 10px;">
      <input
        type="text"
        class="form-control"
        placeholder="Buscar cita por título..." 
        v-model="searchQuery" 
        @keyup.enter="performSearch" 
      />
      <button class="btn btn-primary" @click="performSearch">Buscar</button> 
      <button class="btn btn-secondary" @click="clearSearch" v-if="searchQuery">Limpiar</button> 
    </div>

    <!-- Botón para abrir el modal de creación -->
    <button class="btn btn-primary mb-3" @click="openCreateModal">Crear Cita</button>

    <!-- Tabla para mostrar las citas -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Acciones</th> 
        </tr>
      </thead>
      <transition-group name="list" tag="tbody">
        <tr v-for="cita in citas" :key="cita.id"> 
          <td>{{ cita.title }}</td> 
          <td>{{ cita.description }}</td> 
          <td>{{ formatDate(cita.date) }}</td> 
          <td>{{ cita.time }}</td> 
          <td>
            <button class="btn btn-sm btn-info me-2" @click="viewDetails(cita)">Ver</button> 
            <button class="btn btn-sm btn-warning me-2" @click="editCita(cita)">Editar</button> 
            <button class="btn btn-sm btn-danger" @click="deleteCita(cita.id)">Eliminar</button> 
          </td>
        </tr>
      </transition-group>
    </table>

    <!-- Botón para cargar más citas si hay páginas disponibles -->
    <div class="text-center my-3" v-if="hasNextPage">
      <button class="btn btn-secondary" @click="loadMore">Cargar Más</button>
    </div>

    <!-- Modal para mostrar los detalles de una cita -->
    <b-modal v-model="showDetailsModal" title="Detalles de Cita" hide-footer>
      <p><strong>Título:</strong> {{ selectedCita.title }}</p> 
      <p><strong>Descripción:</strong> {{ selectedCita.description }}</p> 
      <p><strong>Fecha:</strong> {{ formatDate(selectedCita.date) }}</p> 
      <p><strong>Hora:</strong> {{ selectedCita.time }}</p> 
    </b-modal>

    <!-- Modal para crear o editar citas -->
    <b-modal
      v-model="showCreateModal"
      :title="isEditing ? 'Editar Cita' : 'Crear Cita'" 
      hide-footer
      @shown="focusFirstInput" 
    >
      <!-- Formulario para crear/editar citas -->
      <div class="mb-3">
        <label for="title" class="form-label">Título</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="form.title"
          required
          placeholder="Ingresa el título"
        />
        <div v-if="errors.title" class="text-danger">{{ errors.title }}</div> 
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Descripción</label>
        <textarea
          class="form-control"
          id="description"
          v-model="form.description"
          rows="3"
          required
          placeholder="Ingresa la descripción"
        ></textarea>
        <div v-if="errors.description" class="text-danger">{{ errors.description }}</div> 
      </div>
      <div class="mb-3">
        <label for="date" class="form-label">Fecha</label>
        <input
          type="date"
          class="form-control"
          id="date"
          v-model="form.date"
          required
        />
        <div v-if="errors.date" class="text-danger">{{ errors.date }}</div> 
      </div>
      <div class="mb-3">
        <label for="time" class="form-label">Hora</label>
        <input
          type="time"
          class="form-control"
          id="time"
          v-model="form.time"
          required
        />
        <div v-if="errors.time" class="text-danger">{{ errors.time }}</div> 
      </div>
      <button
        type="button"
        class="btn btn-success w-100"
        @click="isEditing ? updateCitaHandler() : createCitaHandler()" 
      >
        {{ isEditing ? 'Actualizar' : 'Crear' }} 
      </button>
    </b-modal>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useCitasStore } from '../../stores/citas';
import { BModal } from 'bootstrap-vue-3';

export default {
  name: 'CitasList',
  components: {
    BModal, // Componente de modal proporcionado por Bootstrap-Vue
  },
  setup() {
    // VARIABLES DE ESTADO
    const citasStore = useCitasStore(); // Acceso al store para manejar las citas
    const showDetailsModal = ref(false); // Controla la visibilidad del modal de detalles
    const showCreateModal = ref(false); // Controla la visibilidad del modal de crear/editar citas
    const selectedCita = ref({}); // Almacena la cita seleccionada para detalles
    const isEditing = ref(false); // Indica si se está en modo edición
    const editingId = ref(null); // Almacena el ID de la cita en edición
    const searchQuery = ref(citasStore.searchQuery); // Almacena el texto de búsqueda actual

    const form = ref({
      title: '', // Título de la cita
      description: '', // Descripción de la cita
      date: '', // Fecha de la cita
      time: '', // Hora de la cita
    });

    const errors = ref({
      title: '', // Error relacionado con el título
      description: '', // Error relacionado con la descripción
      date: '', // Error relacionado con la fecha
      time: '', // Error relacionado con la hora
    });

    // EVENTOS GENERADOS
    // - fetchCitas: Obtiene las citas de la primera página.
    // - loadMore: Carga más citas si hay páginas disponibles.
    // - performSearch: Realiza una búsqueda de citas.
    // - clearSearch: Limpia el texto de búsqueda.
    // - viewDetails: Muestra los detalles de una cita seleccionada.
    // - openCreateModal: Abre el modal para crear una nueva cita.
    // - createCitaHandler: Maneja la creación de una nueva cita.
    // - editCita: Carga los datos de una cita en el formulario para edición.
    // - updateCitaHandler: Actualiza los datos de una cita existente.
    // - deleteCita: Elimina una cita seleccionada.

    const fetchCitas = async () => {
      await citasStore.fetchFirstPage(3, searchQuery.value); // Obtiene la primera página de citas
    };

    const loadMore = async () => {
      await citasStore.fetchNextPage(3, searchQuery.value); // Carga más citas
    };

    const hasNextPage = computed(() => citasStore.pagination.hasNextPage); // Verifica si hay más páginas

    const viewDetails = (cita) => {
      selectedCita.value = cita; // Almacena la cita seleccionada
      showDetailsModal.value = true; // Muestra el modal de detalles
    };

    const openCreateModal = () => {
      isEditing.value = false; // Cambia al modo de creación
      editingId.value = null;
      form.value.title = '';
      form.value.description = '';
      form.value.date = '';
      form.value.time = '';
      errors.value.title = '';
      errors.value.description = '';
      errors.value.date = '';
      errors.value.time = '';
      showCreateModal.value = true; // Abre el modal
    };

    const focusFirstInput = async () => {
      await nextTick();
      const firstInput = document.querySelector('#title'); // Enfoca el primer input
      if (firstInput) firstInput.focus();
    };

    const createCitaHandler = async () => {
      // Validaciones para el formulario
      let valid = true;
      errors.value.title = '';
      errors.value.description = '';
      errors.value.date = '';
      errors.value.time = '';

      if (!form.value.title.trim()) {
        errors.value.title = 'Título es requerido';
        valid = false;
      }

      if (!form.value.description.trim()) {
        errors.value.description = 'Descripción es requerida';
        valid = false;
      }

      if (!form.value.date) {
        errors.value.date = 'Fecha es requerida';
        valid = false;
      }

      if (!form.value.time) {
        errors.value.time = 'Hora es requerida';
        valid = false;
      }

      if (!valid) return;

      try {
        await citasStore.createCita({ ...form.value }); // Crea la nueva cita
        showCreateModal.value = false; // Cierra el modal
        form.value.title = '';
        form.value.description = '';
        form.value.date = '';
        form.value.time = '';
        fetchCitas(); // Actualiza la lista
      } catch (error) {
        console.error('Error al crear cita:', error);
      }
    };

    const editCita = (cita) => {
      // Carga los datos de la cita en el formulario para edición
      isEditing.value = true;
      editingId.value = cita.id;
      form.value.title = cita.title;
      form.value.description = cita.description;
      form.value.date = cita.date;
      form.value.time = cita.time;
      errors.value.title = '';
      errors.value.description = '';
      errors.value.date = '';
      errors.value.time = '';
      showCreateModal.value = true; // Abre el modal de edición
    };

    const updateCitaHandler = async () => {
      // Similar a `createCitaHandler` pero actualiza una cita existente
      let valid = true;
      errors.value.title = '';
      errors.value.description = '';
      errors.value.date = '';
      errors.value.time = '';

      if (!form.value.title.trim()) {
        errors.value.title = 'Título es requerido';
        valid = false;
      }

      if (!form.value.description.trim()) {
        errors.value.description = 'Descripción es requerida';
        valid = false;
      }

      if (!form.value.date) {
        errors.value.date = 'Fecha es requerida';
        valid = false;
      }

      if (!form.value.time) {
        errors.value.time = 'Hora es requerida';
        valid = false;
      }

      if (!valid) return;

      try {
        await citasStore.updateCita(editingId.value, { ...form.value }); // Actualiza la cita
        showCreateModal.value = false; // Cierra el modal
        form.value.title = '';
        form.value.description = '';
        form.value.date = '';
        form.value.time = '';
        isEditing.value = false; // Cambia al modo de creación
        editingId.value = null;
        fetchCitas(); // Actualiza la lista
      } catch (error) {
        console.error('Error al actualizar cita:', error);
      }
    };

    const deleteCita = async (id) => {
      if (confirm('¿Estás seguro de eliminar esta cita?')) {
        try {
          await citasStore.deleteCita(id); // Elimina la cita
          fetchCitas(); // Actualiza la lista
        } catch (error) {
          console.error('Error al eliminar cita:', error);
        }
      }
    };

    const formatDate = (dateString) => {
      // Formatea una fecha para mostrarla de manera más legible
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const performSearch = () => {
      // Realiza una búsqueda en base al texto de búsqueda actual
      citasStore.setSearchQuery(searchQuery.value);
      fetchCitas();
    };

    const clearSearch = () => {
      // Limpia el texto de búsqueda y actualiza la lista de citas
      searchQuery.value = '';
      citasStore.setSearchQuery('');
      fetchCitas();
    };

    onMounted(() => {
      // Carga las citas al montar el componente
      fetchCitas();
    });

    return {
      citas: computed(() => citasStore.citas), // Lista de citas obtenidas del store
      showDetailsModal, // Control del modal de detalles
      selectedCita, // Cita seleccionada para mostrar detalles
      showCreateModal, // Control del modal de crear/editar
      form, // Datos del formulario
      errors, // Errores del formulario
      openCreateModal, // Abre el modal de creación
      createCitaHandler, // Maneja la creación de citas
      editCita, // Maneja la edición de citas
      updateCitaHandler, // Maneja la actualización de citas
      deleteCita, // Maneja la eliminación de citas
      isEditing, // Indica si se está editando una cita
      hasNextPage, // Indica si hay más páginas
      loadMore, // Carga más citas
      viewDetails, // Muestra los detalles de una cita
      formatDate, // Formatea las fechas
      focusFirstInput, // Enfoca el primer input del modal
      searchQuery, // Texto de búsqueda actual
      performSearch, // Realiza la búsqueda
      clearSearch, // Limpia el texto de búsqueda
    };
  },
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s; /* Transición suave para las animaciones */
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px); /* Animación al entrar */
}
.list-leave-to {
  opacity: 0;
  transform: translateY(20px); /* Animación al salir */
}
.text-danger {
  font-size: 0.875em; /* Tamaño reducido para mensajes de error */
}
</style>
