<!-- src/App.vue -->

<!--
Este componente principal maneja la estructura general de la aplicación, incluyendo la barra de navegación y la renderización de vistas según la ruta actual.
-->

<template>
  <div id="app">
    <!-- Barra de navegación -->
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-container>
        <!-- Marca de la aplicación -->
        <b-navbar-brand href="#">MelodyStudio</b-navbar-brand>
        <!-- Botón para colapsar la barra en pantallas pequeñas -->
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <!-- Contenido colapsable de la barra -->
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="me-auto">
            <!-- Enlaces para usuarios autenticados -->
            <template v-if="isAuthenticated">
              <!-- Enlaces para usuarios que no son administradores -->
              <template v-if="userRole !== 'admin'">
                <b-nav-item to="/">Inicio</b-nav-item>
              </template>
              <!-- Enlaces específicos para administradores -->
              <template v-if="userRole === 'admin'">
                <b-nav-item to="/admin">Panel de Administrador</b-nav-item>
              </template>
              <!-- Enlaces específicos para clientes -->
              <template v-else-if="userRole === 'client'">
                <b-nav-item to="/client">Panel de Usuario</b-nav-item>
                <b-nav-item to="/citas">Mis Citas</b-nav-item>
                <b-nav-item to="/incidencias">Mis Incidencias</b-nav-item>
              </template>
            </template>

            <!-- Enlaces para usuarios no autenticados -->
            <template v-else>
              <b-nav-item to="/">Inicio</b-nav-item>
              <b-nav-item to="/login">Iniciar Sesión</b-nav-item>
              <b-nav-item to="/register">Registrarse</b-nav-item>
            </template>
          </b-navbar-nav>

          <!-- Dropdown para cerrar sesión -->
          <b-navbar-nav class="ms-auto">
            <template v-if="isAuthenticated">
              <b-nav-item-dropdown right>
                <template #button-content>
                  <em>{{ displayName }}</em>
                </template>
                <b-dropdown-item @click="logout">Cerrar Sesión</b-dropdown-item>
              </b-nav-item-dropdown>
            </template>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>

    <!-- Transición entre vistas -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
// Importación de Bootstrap-Vue-3 y la store de autenticación
import { computed } from 'vue';
import { useAuthStore } from './stores/auth';
import {
  BNavbar,
  BNavbarBrand,
  BNavbarToggle,
  BCollapse,
  BNavbarNav,
  BNavItem,
  BNavItemDropdown,
  BDropdownItem,
  BContainer,
} from 'bootstrap-vue-3';

export default {
  name: 'App', // Nombre del componente principal
  components: {
    BNavbar,
    BNavbarBrand,
    BNavbarToggle,
    BCollapse,
    BNavbarNav,
    BNavItem,
    BNavItemDropdown,
    BDropdownItem,
    BContainer,
  },
  setup() {
    const authStore = useAuthStore(); // Acceso a la store de autenticación

    // Computed para determinar si el usuario está autenticado
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    // Computed para obtener el rol del usuario autenticado
    const userRole = computed(() => authStore.user?.role || '');
    // Computed para mostrar el nombre o correo del usuario
    const displayName = computed(() => authStore.user?.displayName || authStore.user?.email || 'Usuario');

    /**
     * logout
     * Método que cierra sesión y limpia la información del usuario.
     */
    const logout = () => {
      authStore.logout();
    };

    return {
      isAuthenticated,
      userRole,
      displayName,
      logout,
    };
  },
};
</script>

<style>
/* Estilos para las transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos adicionales para la aplicación */
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>

<!--
EVENTOS GENERADOS:
- `click` en "Cerrar Sesión": llama al método `logout` para finalizar la sesión.
- Navegación mediante `router-link` según las rutas definidas.

VARIABLES Y MÉTODOS:
- `isAuthenticated`: Computed que indica si el usuario está autenticado.
- `userRole`: Computed que define el rol del usuario autenticado (admin, client, etc.).
- `displayName`: Computed que muestra el nombre o correo del usuario.
- `logout`: Método que utiliza la store para cerrar sesión y redirigir al login.

Este componente maneja la barra de navegación y organiza el renderizado de vistas según la ruta y el estado del usuario.
-->
