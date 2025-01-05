<!-- src/views/RegisterView.vue -->

<!--
Este componente permite a los usuarios registrarse en la aplicación.
Incluye un formulario con validación básica para capturar nombre de usuario, correo electrónico y contraseña.
Envía los datos al backend para crear un nuevo cliente.
-->

<template>
  <div class="container mt-5">
    <h3 class="text-center">Registrarse</h3>
    <!-- Formulario de registro -->
    <form @submit.prevent="onSubmit">
      <!-- Campo para el nombre de usuario -->
      <div class="mb-3">
        <label for="username" class="form-label">Nombre de Usuario</label>
        <input
          type="text"
          id="username"
          class="form-control"
          v-model="form.username"
          placeholder="Ingresa tu nombre de usuario"
        />
      </div>
      <!-- Campo para el correo electrónico -->
      <div class="mb-3">
        <label for="email" class="form-label">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          class="form-control"
          v-model="form.email"
          placeholder="Ingresa tu correo"
        />
      </div>
      <!-- Campo para la contraseña -->
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input
          type="password"
          id="password"
          class="form-control"
          v-model="form.password"
          placeholder="Ingresa tu contraseña"
        />
      </div>
      <!-- Botón para enviar el formulario -->
      <button type="submit" class="btn btn-success w-100">Registrarse</button>
      <!-- Mensaje de éxito -->
      <div v-if="response" class="alert alert-success mt-3">
        {{ response }}
      </div>
      <!-- Mensaje de error -->
      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
// Importa axios para realizar las peticiones al backend
import axios from '../plugins/axios';

export default {
  name: 'RegisterView', // Nombre del componente
  data() {
    return {
      form: {
        username: '', // Campo para el nombre de usuario ingresado
        email: '', // Campo para el correo electrónico ingresado
        password: '', // Campo para la contraseña ingresada
      },
      response: null, // Mensaje de éxito al crear el usuario
      error: null, // Mensaje de error al intentar registrarse
    };
  },
  methods: {
    /**
     * onSubmit
     * Maneja el envío del formulario de registro.
     * Envía los datos ingresados al backend para crear un nuevo cliente.
     */
    async onSubmit() {
      try {
        // Crea el objeto de datos para la solicitud
        const payload = {
          email: this.form.email,
          password: this.form.password,
          displayName: this.form.username,
        };
        // Envía la solicitud al backend para registrar al cliente
        const res = await axios.post('/auth/signup-client', payload);
        this.response = 'Te has registrado exitosamente. Ahora puedes iniciar sesión en MelodyStudio.'; // Mensaje de éxito
        this.error = null; // Limpia errores anteriores
      } catch (err) {
        this.response = null; // Limpia el mensaje de éxito
        this.error = err.response?.data?.message || 'Error al crear cliente'; // Establece el mensaje de error
      }
    },
  },
};
</script>

<!--
EVENTOS GENERADOS:
- Evento `submit` en el formulario: llama al método `onSubmit` para manejar el registro del usuario.

VARIABLES Y MÉTODOS:
- `form`: Objeto que contiene los datos del formulario (username, email, password).
- `response`: Mensaje que indica el éxito de la operación.
- `error`: Mensaje que indica un error durante el registro.
- `onSubmit`: Método que valida los datos, los envía al backend y actualiza el estado basado en el resultado.
-->
