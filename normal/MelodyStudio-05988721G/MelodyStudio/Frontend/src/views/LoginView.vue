<!-- Frontend/src/views/LoginView.vue -->

<!--
Este componente proporciona una interfaz para que los usuarios inicien sesión en la aplicación.
Incluye validación básica en el formulario y un efecto visual en caso de error.
-->

<template>
  <div class="container mt-5">
    <h3 class="text-center">Iniciar Sesión</h3>
    <!-- Formulario de inicio de sesión -->
    <form @submit.prevent="onSubmit" :class="{ shake: isError }">
      <!-- Campo de correo electrónico -->
      <div class="mb-3">
        <label for="email" class="form-label">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          class="form-control"
          v-model="form.email"
          placeholder="Ingresa tu correo"
          :class="{ 'is-invalid': isError && !form.email }"
        />
      </div>
      <!-- Campo de contraseña -->
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input
          type="password"
          id="password"
          class="form-control"
          v-model="form.password"
          placeholder="Ingresa tu contraseña"
          :class="{ 'is-invalid': isError && !form.password }"
        />
      </div>
      <!-- Botón de envío -->
      <button
        type="submit"
        class="btn btn-primary w-100"
        :class="{ 'btn-shake': isError }"
      >
        Iniciar Sesión
      </button>
      <!-- Mensaje de respuesta en caso de éxito -->
      <div v-if="response" class="alert alert-success mt-3">
        {{ response }}
      </div>
      <!-- Mensaje de error en caso de fallo -->
      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
// Importa la store de autenticación de Pinia
import { useAuthStore } from '../stores/auth';
import { ref, computed } from 'vue';

export default {
  name: 'LoginView', // Nombre del componente
  data() {
    return {
      form: {
        email: '', // Campo para el correo electrónico del usuario
        password: '', // Campo para la contraseña del usuario
      },
      response: null, // Mensaje de éxito tras iniciar sesión
      error: null, // Mensaje de error en caso de fallo
      isError: false, // Controla el efecto de "temblor" en caso de error
    };
  },
  setup() {
    const authStore = useAuthStore(); // Acceso a la store de autenticación
    return { authStore }; // Devuelve la store para ser usada en el componente
  },
  methods: {
    /**
     * onSubmit
     * Maneja el evento de envío del formulario.
     * Llama a la store de autenticación para iniciar sesión y actualiza el estado basado en el resultado.
     */
    async onSubmit() {
      try {
        // Llama a la acción login de la store de Pinia
        await this.authStore.login(this.form.email, this.form.password);
        this.response = 'Inicio de sesión exitoso'; // Mensaje de éxito
        this.error = null; // Limpia el error anterior
        this.isError = false; // Desactiva el efecto de temblor
      } catch (err) {
        this.response = null; // Limpia el mensaje de éxito
        this.error = err.response?.data?.message || 'Error al iniciar sesión'; // Establece el mensaje de error
        this.isError = true; // Activa el efecto de temblor
        // Remueve el efecto de temblor después de la animación
        setTimeout(() => {
          this.isError = false;
        }, 500); // Duración de la animación en milisegundos
      }
    },
  },
};
</script>

<style scoped>
/* Estilo para centrar el contenedor */
.container {
  max-width: 400px;
}

/* Animación de temblor */
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s;
}

.btn-shake {
  animation: shake 0.5s;
}

/* Estilo para los campos con errores */
.is-invalid {
  border-color: #dc3545;
}

.text-danger {
  font-size: 0.875em;
}
</style>

<!--
EVENTOS GENERADOS:
- Evento `submit` en el formulario: llama al método `onSubmit` para manejar el inicio de sesión.
- Actualización de campos de entrada (`v-model`): sincroniza los valores de `email` y `password` con el estado.

VARIABLES Y MÉTODOS:
- `form`: Objeto que contiene los datos del formulario (correo y contraseña).
- `response`: Mensaje de éxito al iniciar sesión.
- `error`: Mensaje de error en caso de fallo al iniciar sesión.
- `isError`: Booleano para controlar el efecto de temblor en el formulario.
- `authStore`: Instancia de la store de autenticación para manejar el inicio de sesión.
- `onSubmit`: Método que valida los datos y llama a la store para autenticar al usuario.
-->
