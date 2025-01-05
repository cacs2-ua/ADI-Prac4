<!-- src/views/NotFound.vue -->

<!--
Este componente representa la vista de error 404 que se muestra cuando un usuario intenta acceder a una ruta no existente en la aplicación.
Proporciona un mensaje de error y un enlace para regresar a la página principal.
-->

<template>
  <div class="container text-center mt-5">
    <!-- Título de la página de error -->
    <h1>404 - Página No Encontrada</h1>
    <!-- Mensaje descriptivo del error -->
    <p>La página que buscas no existe.</p>
    <!-- Enlace para volver a la página principal -->
    <router-link to="/" class="btn btn-primary">Volver al Inicio</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound', // Nombre del componente
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>

<!--
EVENTOS GENERADOS:
- Al hacer clic en el enlace "Volver al Inicio", se genera un evento que redirige al usuario a la ruta principal (`/`) utilizando `router-link`.

VARIABLES Y MÉTODOS:
- Este componente no tiene variables de estado ni métodos, ya que solo muestra información estática.

El componente "NotFound" actúa como una página de error genérica para manejar rutas no definidas en la aplicación.
-->
