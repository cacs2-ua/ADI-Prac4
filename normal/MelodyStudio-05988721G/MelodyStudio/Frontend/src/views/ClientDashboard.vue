

<template>
  <div class="container mt-5">
    <h2>Panel de Usuario</h2>
    <button class="btn btn-danger mb-3" @click="logout">Cerrar Sesión</button>


    <div>
      <CitasList />
    </div>
    <div class="mt-5">
      <IncidenciasList />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import CitasList from '../components/citas/CitasList.vue';
import IncidenciasList from '../components/incidencias/IncidenciasList.vue';

export default {
  name: 'ClientDashboard',
  components: {
    CitasList,
    IncidenciasList,
  },
  setup() {
    const authStore = useAuthStore();

    const logout = () => {
      authStore.logout();
    };

    return {
      logout,
    };
  },
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>
