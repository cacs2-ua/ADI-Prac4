<!-- Frontend/src/home/HeroSection.vue -->

<!-- 
Este componente representa la sección principal (Hero) de la página de inicio de MelodyStudio.
Incluye un fondo animado, un mensaje de bienvenida, una breve descripción y un botón para redirigir al usuario
a la página de reserva de citas.
-->

<template>
  <div
    class="hero-section d-flex align-items-center justify-content-center text-center text-white"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <!-- Superposición oscura para mejorar la visibilidad del contenido -->
    <div class="overlay"></div>
    <div class="content">
      <!-- Título principal con animación -->
      <h1 class="display-4 animated fadeInDown">Bienvenido a MelodyStudio</h1>
      <!-- Descripción breve con animación -->
      <p class="lead animated fadeInUp delay-1s">
        Tu espacio profesional para grabar maquetas y producciones musicales.
      </p>
      <!-- Botón para redirigir a la página de reservas -->
      <b-button
        variant="success"
        size="lg"
        @click="bookNow"
        class="animated fadeInUp delay-2s"
      >
        Reserva tu Cita
      </b-button>
    </div>
  </div>
</template>

<script>
import backgroundImage from '@/assets/images/hero-background.jpg'; // Importa la imagen de fondo

export default {
  name: 'HeroSection', // Nombre del componente
  data() {
    return {
      backgroundImage, // Imagen de fondo de la sección Hero
    };
  },
  methods: {
    /**
     * bookNow
     * Redirige al usuario a la página de lista de citas (CitasList).
     * No recibe parámetros y utiliza `$router.push` para cambiar la ruta.
     */
    bookNow() {
      this.$router.push({ name: 'CitasList' }); // Redirige a la página de reservas
    },
  },
};
</script>

<style scoped>
/* Estilo principal para la sección Hero */
.hero-section {
  position: relative; /* Asegura que los elementos hijos como la superposición se posicionen correctamente */
  height: 100vh; /* Ocupa toda la altura de la ventana */
  background-size: cover; /* Ajusta el tamaño del fondo para cubrir el área */
  background-position: center; /* Centra la imagen de fondo */
}

/* Superposición oscura para mejorar el contraste del texto */
.overlay {
  position: absolute; /* Cubre toda la sección Hero */
  top: 0;
  left: 0;
  width: 100%; /* Ancho completo */
  height: 100%; /* Altura completa */
  background-color: rgba(0, 0, 0, 0.5); /* Color negro con transparencia */
}

/* Contenedor del contenido */
.content {
  position: relative; /* Asegura que el contenido esté encima de la superposición */
  z-index: 2; /* Eleva el contenido por encima de la superposición */
}

/* Clases para animaciones */
.animated {
  animation-duration: 1s; /* Duración de la animación */
  animation-fill-mode: both; /* La animación conserva su estado final */
}

.fadeInDown {
  animation-name: fadeInDown; /* Aplica la animación desde arriba hacia abajo */
}

.fadeInUp {
  animation-name: fadeInUp; /* Aplica la animación desde abajo hacia arriba */
}

.delay-1s {
  animation-delay: 1s; /* Retraso de 1 segundo antes de iniciar la animación */
}

.delay-2s {
  animation-delay: 2s; /* Retraso de 2 segundos antes de iniciar la animación */
}

/* Definición de animaciones */
@keyframes fadeInDown {
  from {
    opacity: 0; /* Inicia invisible */
    transform: translateY(-50px); /* Comienza más arriba */
  }
  to {
    opacity: 1; /* Termina visible */
    transform: translateY(0); /* Regresa a su posición original */
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0; /* Inicia invisible */
    transform: translateY(50px); /* Comienza más abajo */
  }
  to {
    opacity: 1; /* Termina visible */
    transform: translateY(0); /* Regresa a su posición original */
  }
}
</style>
