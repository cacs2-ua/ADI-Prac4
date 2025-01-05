// src/router/index.js

/*
Este archivo configura las rutas de la aplicación utilizando Vue Router.
Define las rutas disponibles, sus componentes asociados y las reglas de acceso mediante meta datos y guards de navegación.
*/

// Importación de Vue Router y componentes asociados
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'; // Vista principal
import LoginView from '../views/LoginView.vue'; // Vista de inicio de sesión
import RegisterView from '../views/RegisterView.vue'; // Vista de registro
import AdminDashboard from '../views/AdminDashboard.vue'; // Dashboard para administradores
import ClientDashboard from '../views/ClientDashboard.vue'; // Dashboard para clientes
import IncidenciasList from '../components/incidencias/IncidenciasList.vue'; // Componente para listar incidencias
import CitasList from '../components/citas/CitasList.vue'; // Componente para listar citas
import NotFound from '../views/NotFound.vue'; // Página 404

import { useAuthStore } from '../stores/auth'; // Importa la store para la autenticación

// Definición de rutas
const routes = [
  {
    path: '/', // Ruta raíz
    name: 'Home',
    component: HomeView, // Componente asociado
  },
  {
    path: '/login', // Ruta de inicio de sesión
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register', // Ruta de registro
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false, role: 'client' }, // Solo accesible para clientes no autenticados
  },
  {
    path: '/admin', // Ruta del dashboard de administrador
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }, // Requiere autenticación y rol de administrador
  },
  {
    path: '/client', // Ruta del dashboard de cliente
    name: 'ClientDashboard',
    component: ClientDashboard,
    meta: { requiresAuth: true, role: 'client' }, // Requiere autenticación y rol de cliente
  },
  {
    path: '/incidencias', // Ruta para listar incidencias
    name: 'IncidenciasList',
    component: IncidenciasList,
    meta: { requiresAuth: true }, // Requiere autenticación
  },
  {
    path: '/citas', // Ruta para listar citas
    name: 'CitasList',
    component: CitasList,
    meta: { requiresAuth: true }, // Requiere autenticación
  },
  {
    path: '/:pathMatch(.*)*', // Ruta comodín para páginas no encontradas
    name: 'NotFound',
    component: NotFound, // Componente 404
  },
];

// Creación del router con historial
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guards de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Accede a la store de autenticación

  const requiresAuth = to.meta.requiresAuth; // Verifica si la ruta requiere autenticación
  const userRole = authStore.user?.role; // Rol del usuario autenticado

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirige al login si no está autenticado
    next({ name: 'Login' });
  } else if (requiresAuth && to.meta.role && to.meta.role !== userRole) {
    // Redirige al dashboard correspondiente si el rol no coincide
    if (userRole === 'admin') {
      next({ name: 'AdminDashboard' });
    } else if (userRole === 'client') {
      next({ name: 'ClientDashboard' });
    } else {
      next({ name: 'Login' }); // Redirige al login si el rol no está definido
    }
  } else {
    // Permite la navegación si no hay restricciones
    next();
  }
});

export default router;

/*
EVENTOS GENERADOS:
- Redirección al login si el usuario no está autenticado.
- Redirección al dashboard correspondiente dependiendo del rol del usuario.

VARIABLES:
- `routes`: Arreglo que define las rutas y sus configuraciones.
- `authStore`: Store que gestiona el estado de autenticación.
- `requiresAuth`: Meta propiedad de las rutas que indica si requieren autenticación.
- `userRole`: Rol del usuario autenticado.

MÉTODOS:
- `router.beforeEach`: Interceptor que se ejecuta antes de cada cambio de ruta para aplicar lógica de autenticación y roles.
*/
