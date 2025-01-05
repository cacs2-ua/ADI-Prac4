<!-- src/components/incidencias/IncidenciasList.vue -->

<!-- 
Este componente permite gestionar una lista de incidencias. 
Incluye funcionalidades como búsqueda, creación, edición, eliminación y visualización de detalles de incidencias, 
además de la capacidad de cargar más datos de manera paginada.
-->

<template>
  <div>
    <h4>Mis Incidencias</h4>
    <br />

    <div class="mb-3 d-flex" style="gap: 10px;">

      <input
        type="text"
        class="form-control"
        placeholder="Buscar incidencia por título..."
        v-model="searchQuery" 
        @keyup.enter="performSearch" 
      />
      <button class="btn btn-primary" @click="performSearch">Buscar</button> 
      <button class="btn btn-secondary" @click="clearSearch" v-if="searchQuery">Limpiar</button> 
    </div>


    <button class="btn btn-primary mb-3" @click="openCreateModal">Crear Incidencia</button>


    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Fecha de Creación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <transition-group name="list" tag="tbody"> 
        <tr v-for="item in incidencias" :key="item.id">
          <td>{{ item.title }}</td> 
          <td>{{ item.description }}</td> 
          <td>{{ formatDate(item.createdAt) }}</td> 
          <td>
            <button class="btn btn-sm btn-info me-2" @click="viewDetails(item)">Ver</button> 
            <button class="btn btn-sm btn-warning me-2" @click="editIncidencia(item)">Editar</button> 
            <button class="btn btn-sm btn-danger" @click="deleteIncidencia(item.id)">Eliminar</button> 
          </td>
        </tr>
      </transition-group>
    </table>


    <div class="text-center my-3" v-if="hasNextPage">
      <button class="btn btn-secondary" @click="loadMore">Cargar Más</button>
    </div>


    <b-modal v-model="showDetailsModal" title="Detalles de Incidencia" hide-footer>
      <p><strong>Título:</strong> {{ selectedIncidencia.title }}</p>
      <p><strong>Descripción:</strong> {{ selectedIncidencia.description }}</p>
      <p><strong>Creado el:</strong> {{ formatDate(selectedIncidencia.createdAt) }}</p>
    </b-modal>


    <b-modal
      v-model="showCreateModal"
      :title="isEditing ? 'Editar Incidencia' : 'Crear Incidencia'"
      hide-footer
      @shown="focusFirstInput"
    >

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
      <button
        type="button"
        class="btn btn-success w-100"
        @click="isEditing ? updateIncidenciaHandler() : createIncidenciaHandler()" 
      >
        {{ isEditing ? 'Actualizar' : 'Crear' }}
      </button>
    </b-modal>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useIncidenciasStore } from '../../stores/incidencias';
import { BModal } from 'bootstrap-vue-3';

export default {
  name: 'IncidenciasList', // Nombre del componente
  components: {
    BModal, // Modal proporcionado por Bootstrap-Vue
  },
  setup() {
    // VARIABLES DE ESTADO
    const incidenciasStore = useIncidenciasStore(); // Store para gestionar incidencias
    const showDetailsModal = ref(false); // Controla la visibilidad del modal de detalles
    const showCreateModal = ref(false); // Controla la visibilidad del modal de creación/edición
    const selectedIncidencia = ref({}); // Incidencia seleccionada para mostrar detalles
    const isEditing = ref(false); // Indica si se está en modo edición
    const editingId = ref(null); // ID de la incidencia en edición
    const searchQuery = ref(incidenciasStore.searchQuery); // Texto de búsqueda

    const form = ref({
      title: '', // Título de la incidencia
      description: '', // Descripción de la incidencia
    });

    const errors = ref({
      title: '', // Errores del título
      description: '', // Errores de la descripción
    });

    // MÉTODOS
    const fetchIncidencias = async () => {
      await incidenciasStore.fetchFirstPage(3, searchQuery.value); // Carga la primera página de incidencias
    };

    const loadMore = async () => {
      await incidenciasStore.fetchNextPage(3, searchQuery.value); // Carga más incidencias
    };

    const hasNextPage = computed(() => incidenciasStore.pagination.hasNextPage); // Verifica si hay más páginas

    const viewDetails = (incidencia) => {
      selectedIncidencia.value = incidencia; // Asigna la incidencia seleccionada
      showDetailsModal.value = true; // Muestra el modal de detalles
    };

    const openCreateModal = () => {
      isEditing.value = false; // Cambia al modo de creación
      editingId.value = null;
      form.value.title = '';
      form.value.description = '';
      errors.value.title = '';
      errors.value.description = '';
      showCreateModal.value = true; // Abre el modal
    };

    const focusFirstInput = async () => {
      await nextTick();
      const firstInput = document.querySelector('#title'); // Foco automático en el input de título
      if (firstInput) firstInput.focus();
    };

    const createIncidenciaHandler = async () => {
      // Valida los campos antes de crear una incidencia
      let valid = true;
      errors.value.title = '';
      errors.value.description = '';

      if (!form.value.title.trim()) {
        errors.value.title = 'Título es requerido';
        valid = false;
      }

      if (!form.value.description.trim()) {
        errors.value.description = 'Descripción es requerida';
        valid = false;
      }

      if (!valid) return;

      try {
        await incidenciasStore.createIncidencia(form.value.title, form.value.description); // Crea la incidencia
        showCreateModal.value = false; // Cierra el modal
        form.value.title = '';
        form.value.description = '';
        fetchIncidencias(); // Actualiza la lista
      } catch (error) {
        console.error('Error al crear incidencia:', error);
      }
    };

    const editIncidencia = (incidencia) => {
      // Carga los datos de la incidencia para edición
      isEditing.value = true;
      editingId.value = incidencia.id;
      form.value.title = incidencia.title;
      form.value.description = incidencia.description;
      errors.value.title = '';
      errors.value.description = '';
      showCreateModal.value = true; // Abre el modal
    };

    const updateIncidenciaHandler = async () => {
      // Valida los campos antes de actualizar una incidencia
      let valid = true;
      errors.value.title = '';
      errors.value.description = '';

      if (!form.value.title.trim()) {
        errors.value.title = 'Título es requerido';
        valid = false;
      }

      if (!form.value.description.trim()) {
        errors.value.description = 'Descripción es requerida';
        valid = false;
      }

      if (!valid) return;

      try {
        await incidenciasStore.updateIncidencia(editingId.value, {
          title: form.value.title,
          description: form.value.description,
        }); // Actualiza la incidencia
        showCreateModal.value = false;
        form.value.title = '';
        form.value.description = '';
        isEditing.value = false;
        editingId.value = null;
        fetchIncidencias(); // Actualiza la lista
      } catch (error) {
        console.error('Error al actualizar incidencia:', error);
      }
    };

    const deleteIncidencia = async (id) => {
      // Elimina una incidencia después de confirmación
      if (confirm('¿Estás seguro de eliminar esta incidencia?')) {
        try {
          await incidenciasStore.deleteIncidencia(id);
          fetchIncidencias(); // Actualiza la lista
        } catch (error) {
          console.error('Error al eliminar incidencia:', error);
        }
      }
    };

    const formatDate = (dateString) => {
      // Formatea una fecha en un formato legible
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const performSearch = () => {
      // Realiza una búsqueda con el texto ingresado
      incidenciasStore.setSearchQuery(searchQuery.value);
      fetchIncidencias();
    };

    const clearSearch = () => {
      // Limpia la búsqueda
      searchQuery.value = '';
      incidenciasStore.setSearchQuery('');
      fetchIncidencias();
    };

    onMounted(() => {
      fetchIncidencias(); // Carga las incidencias al montar el componente
    });

    return {
      incidencias: computed(() => incidenciasStore.incidencias), // Lista de incidencias desde el store
      showDetailsModal,
      selectedIncidencia,
      showCreateModal,
      form,
      errors,
      openCreateModal,
      createIncidenciaHandler,
      editIncidencia,
      updateIncidenciaHandler,
      deleteIncidencia,
      isEditing,
      hasNextPage,
      loadMore,
      viewDetails,
      formatDate,
      focusFirstInput,
      searchQuery,
      performSearch,
      clearSearch,
    };
  },
};
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.text-danger {
  font-size: 0.875em;
}
</style>
