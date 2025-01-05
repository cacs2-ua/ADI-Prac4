// Frontend/src/main.js

// Este archivo es el punto de entrada principal de la aplicación.
// Configura Vue, Pinia, Vue Router, BootstrapVue, VeeValidate y monta la aplicación en el DOM.

// Importación de Vue y su método para crear la aplicación
import { createApp } from 'vue';
import App from './App.vue'; // Componente raíz
import router from './router'; // Configuración de rutas
import { createPinia } from 'pinia'; // Sistema de estado global
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; // Plugin para persistencia de estado

// Importación de estilos y dependencias de Bootstrap y BootstrapVue
import 'bootstrap/dist/css/bootstrap.min.css'; // Estilos básicos de Bootstrap
import 'bootstrap'; // Funcionalidades de JavaScript de Bootstrap
import BootstrapVue3 from 'bootstrap-vue-3'; // Biblioteca de componentes de BootstrapVue
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'; // Estilos específicos de BootstrapVue
import 'bootstrap-icons/font/bootstrap-icons.css'; // Íconos de Bootstrap

// Importación de componentes de VeeValidate para validaciones
import { Field, Form, ErrorMessage } from 'vee-validate';

// Importación de la store de autenticación
import { useAuthStore } from './stores/auth'; // Asegura que la ruta sea correcta

// Creación de la instancia de la aplicación Vue
const app = createApp(App);

// Configuración de Pinia como sistema de estado global
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // Habilita persistencia de estado con el plugin
app.use(pinia);

// Uso de BootstrapVue en la aplicación
app.use(BootstrapVue3);

// Registro global de los componentes de VeeValidate
app.component('Field', Field); // Campo de formulario
app.component('Form', Form); // Contenedor de formulario
app.component('ErrorMessage', ErrorMessage); // Mensajes de error

// Configuración de Vue Router para manejo de rutas
app.use(router);

// Monta la aplicación en el elemento con id `#app` en el DOM
app.mount('#app');

// Llamada a `fetchUser` para sincronizar el estado del usuario después de montar la aplicación
const authStore = useAuthStore(); // Instancia de la store de autenticación
authStore.fetchUser(); // Sincroniza el estado del usuario autenticado
