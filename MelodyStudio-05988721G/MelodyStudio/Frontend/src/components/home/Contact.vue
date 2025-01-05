<template>
  <div class="contact-section py-5">
    <!-- 
    Sección de contacto que permite a los usuarios enviar un mensaje a través de un formulario.
    Incluye campos para nombre, correo electrónico y mensaje, y muestra alertas de éxito o error 
    dependiendo del resultado del envío.
    -->
    <b-container>
      <h2 class="text-center mb-5">Contáctanos</h2>
      <b-row class="justify-content-center">
        <b-col md="8">
          <!-- Formulario de contacto -->
          <b-form @submit.prevent="handleSubmit">
            <!-- Campo para el nombre del usuario -->
            <b-form-group label="Nombre" label-for="contact-name">
              <b-form-input id="contact-name" v-model="form.name" required placeholder="Tu nombre"></b-form-input>
            </b-form-group>

            <!-- Campo para el correo electrónico del usuario -->
            <b-form-group label="Correo Electrónico" label-for="contact-email">
              <b-form-input
                type="email"
                id="contact-email"
                v-model="form.email"
                required
                placeholder="Tu correo electrónico"
              ></b-form-input>
            </b-form-group>

            <!-- Campo para el mensaje del usuario -->
            <b-form-group label="Mensaje" label-for="contact-message">
              <b-form-textarea
                id="contact-message"
                v-model="form.message"
                required
                placeholder="Tu mensaje"
                rows="5"
              ></b-form-textarea>
            </b-form-group>

            <!-- Botón para enviar el formulario -->
            <b-button type="submit" variant="primary">Enviar Mensaje</b-button>
          </b-form>

          <!-- Alerta de éxito -->
          <b-alert
            v-if="success"
            variant="success"
            dismissible
            @dismissed="success = false"
            class="mt-3"
          >
            ¡Mensaje enviado exitosamente!
          </b-alert>

          <!-- Alerta de error -->
          <b-alert
            v-if="error"
            variant="danger"
            dismissible
            @dismissed="error = null"
            class="mt-3"
          >
            {{ error }}
          </b-alert>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { ref } from 'vue'; // Importa la funcionalidad `ref` de Vue para manejo reactivo de datos.
import apiClient from '@/plugins/axios'; // Cliente Axios para realizar peticiones HTTP.

export default {
  name: 'Contact', // Nombre del componente.
  setup() {
    // VARIABLES DE ESTADO DEL COMPONENTE
    const form = ref({
      name: '', // Nombre del usuario.
      email: '', // Correo electrónico del usuario.
      message: '', // Mensaje ingresado por el usuario.
    });

    const success = ref(false); // Indica si el mensaje fue enviado exitosamente.
    const error = ref(null); // Contiene el mensaje de error si ocurre un problema.

    // MÉTODOS
    const handleSubmit = async () => {
      // Método para manejar el envío del formulario.
      // Envía los datos del formulario al servidor mediante una petición POST.
      try {
        await apiClient.post('/contact', form.value); // Envío del formulario al endpoint '/contact'.
        success.value = true; // Marca el envío como exitoso.
        form.value.name = ''; // Limpia el campo del nombre.
        form.value.email = ''; // Limpia el campo del correo electrónico.
        form.value.message = ''; // Limpia el campo del mensaje.
      } catch (err) {
        // Manejo de errores en caso de fallo en la petición.
        error.value =
          err.response?.data?.error || 'Hubo un error al enviar el mensaje.'; // Asigna un mensaje de error.
      }
    };

    // RETORNO DE VARIABLES Y MÉTODOS
    return {
      form, // Datos del formulario.
      handleSubmit, // Método para manejar el envío del formulario.
      success, // Estado de éxito del envío.
      error, // Mensaje de error si ocurre algún problema.
    };
  },
};
</script>

<style scoped>
/* 
Estilo para la sección de contacto, incluye un fondo claro para destacar la sección en la página.
*/
.contact-section {
  background-color: #f1f1f1;
}
</style>
