<!-- Frontend/src/views/AdminDashboard.vue -->

<!--
Este componente representa el panel de administración de la aplicación.
Permite al administrador gestionar incidencias y citas, y ofrece la funcionalidad de cerrar sesión.
-->

<template>
  <div class="container mt-5">
    <h2>Panel de Administrador</h2>
    <!-- Botón para cerrar sesión -->
    <button class="btn btn-danger mb-3" @click="logout">Cerrar Sesión</button>

    <!-- Sección dividida para listar incidencias y citas -->
    <div class="row">
      <div class="col-md-6">
        <h4>Incidencias</h4>
        <AdminIncidenciasList /> <!-- Componente para listar incidencias -->
      </div>
      <div class="col-md-6">
        <h4>Citas</h4>
        <AdminCitasList /> <!-- Componente para listar citas -->
      </div>
    </div>
  </div>
</template>

<script>
// Importa la store de autenticación y los componentes para listar incidencias y citas
import { useAuthStore } from '../stores/auth';
import AdminIncidenciasList from '../components/admin/AdminIncidenciasList.vue';
import AdminCitasList from '../components/admin/AdminCitasList.vue';

export default {
  name: 'AdminDashboard', // Nombre del componente
  components: {
    AdminIncidenciasList, // Componente para gestionar incidencias
    AdminCitasList, // Componente para gestionar citas
  },
  setup() {
    const authStore = useAuthStore(); // Acceso a la store de autenticación

    /**
     * logout
     * Cierra la sesión del administrador y redirige al login.
     */
    const logout = () => {
      authStore.logout(); // Llama al método de la store para cerrar sesión
    };

    return {
      logout, // Devuelve el método para ser usado en el template
    };
  },
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>

<!--
EVENTOS GENERADOS:
- Click en el botón "Cerrar Sesión": llama al método `logout` para finalizar la sesión.

VARIABLES Y MÉTODOS:
- `authStore`: Instancia de la store de autenticación que permite gestionar el estado del usuario.
- `logout`: Método que utiliza la store para cerrar sesión y limpiar la información del usuario.
- `AdminIncidenciasList`: Componente que gestiona y muestra las incidencias.
- `AdminCitasList`: Componente que gestiona y muestra las citas.
-->
