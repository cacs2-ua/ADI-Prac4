<!-- Frontend/src/home/Testimonials.vue -->

<!-- 
Este componente muestra un carrusel con testimonios de clientes satisfechos de MelodyStudio. 
Cada testimonio incluye una imagen, el nombre del cliente y un comentario sobre su experiencia.
Si no hay testimonios disponibles, se muestra un mensaje alternativo.
-->

<template>
  <div class="testimonials-section py-5 bg-dark text-white">
    <div class="container">
      <h2 class="text-center mb-5">Lo Que Dicen Nuestros Clientes</h2>

      <!-- Contenedor principal con v-if y v-else -->
      <div>
        <!-- Carrusel Nativo de Bootstrap -->
        <div
          v-if="testimonials.length > 0"
          id="carouselExampleIndicators"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <!-- Indicadores del carrusel -->
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              class="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          <!-- Elementos del carrusel -->
          <div class="carousel-inner">
            <!-- Iteración sobre los testimonios -->
            <div
              class="carousel-item"
              v-for="(testimonial, index) in testimonials"
              :class="{ active: index === 0 }" 
              :key="testimonial.id"
            >
              <img :src="testimonial.image" class="d-block w-100" :alt="`Imagen de ${testimonial.name}`" /> <!-- Imagen del testimonio -->
              <div class="carousel-caption d-none d-md-block">
                <h5>{{ testimonial.name }}</h5> <!-- Nombre del cliente -->
                <p>{{ testimonial.text }}</p> <!-- Texto del testimonio -->
              </div>
            </div>
          </div>

          <!-- Controles del carrusel -->
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>

        <!-- Mensaje alternativo si no hay testimonios -->
        <div v-else class="text-center text-danger">
          <p>No hay testimonios disponibles para mostrar.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JuanImage from "@/assets/images/testimonials/juan.jpg"; // Importa la imagen del testimonio de Juan
import MariaImage from "@/assets/images/testimonials/maria.jpg"; // Importa la imagen del testimonio de María
import CarlosImage from "@/assets/images/testimonials/carlos.jpg"; // Importa la imagen del testimonio de Carlos

export default {
  name: "Testimonials", // Nombre del componente
  data() {
    return {
      // Arreglo de testimonios
      testimonials: [
        {
          id: 1, // ID único del testimonio
          name: "Juan Pérez", // Nombre del cliente
          text: "MelodyStudio transformó mi proyecto musical. El ambiente profesional y el equipo de ingenieros hicieron de mi grabación una experiencia inigualable.", // Texto del testimonio
          image: JuanImage, // Imagen del cliente
        },
        {
          id: 2,
          name: "María Gómez",
          text: "La facilidad para reservar citas y la calidad del sonido superaron mis expectativas. ¡Recomiendo MelodyStudio a todos los músicos!",
          image: MariaImage,
        },
        {
          id: 3,
          name: "Carlos Ruiz",
          text: "Un equipo excepcional y un espacio increíble. MelodyStudio es el lugar perfecto para llevar tu música al siguiente nivel.",
          image: CarlosImage,
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Ajustes del tamaño del carrusel */
.testimonials-section img {
  height: 400px; /* Altura de las imágenes del carrusel */
  width: 100%; /* Ancho completo para las imágenes */
  object-fit: cover; /* Ajuste de la imagen para que se vea correctamente */
  border-radius: 10px; /* Bordes redondeados para las imágenes */
}

#carouselExampleIndicators {
  max-width: 800px; /* Ancho máximo del carrusel */
  margin: 0 auto; /* Centra el carrusel en la página */
}

.carousel-inner {
  height: 400px; /* Ajusta la altura del contenedor interno */
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.6); /* Fondo oscuro semitransparente para el texto */
  padding: 1rem; /* Espaciado interno */
  border-radius: 5px; /* Bordes redondeados */
  font-size: 1rem; /* Tamaño del texto */
}
</style>
