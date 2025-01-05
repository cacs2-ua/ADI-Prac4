<template>
  <div class="features-section py-5">
    <!-- 
    Este componente muestra una sección destacada con características de MelodyStudio. 
    Incluye tarjetas que resaltan cuando el usuario pasa el cursor sobre ellas, 
    utilizando un efecto visual para mejorar la experiencia del usuario.
    -->
    <b-container>
      <h2 class="text-center mb-5">¿Por Qué Elegir MelodyStudio?</h2>
      <b-row>
        <!-- Iteración sobre las características para mostrar cada una en una tarjeta -->
        <b-col md="4" v-for="feature in features" :key="feature.id" class="mb-4">
          <b-card
            class="text-center h-100 feature-card"
            @mouseover="hoverFeature(feature.id)" 
            @mouseleave="unhoverFeature(feature.id)" 
            :class="{ 'shadow-lg': feature.isHovered }" 
          >
            <i :class="`bi bi-${feature.icon}`" class="text-primary fs-3"></i> <!-- Ícono dinámico -->
            <h4 class="mt-3">{{ feature.title }}</h4> <!-- Título de la característica -->
            <p>{{ feature.description }}</p> <!-- Descripción de la característica -->
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Features', // Nombre del componente
  data() {
    return {
      features: [
        {
          id: 1,
          icon: 'record-circle', // Ícono para identificar la característica (Bootstrap Icons)
          title: 'Estudios Profesionales', // Título de la característica
          description:
            'Accede a estudios equipados con la última tecnología para garantizar la mejor calidad de grabación.', // Descripción de la característica
          isHovered: false, // Indica si el cursor está sobre la tarjeta
        },
        {
          id: 2,
          icon: 'headset',
          title: 'Ingenieros de Sonido Expertos',
          description:
            'Nuestros ingenieros tienen años de experiencia en producción musical para ayudarte a alcanzar tu visión.',
          isHovered: false,
        },
        {
          id: 3,
          icon: 'calendar',
          title: 'Fácil Reserva de Citas',
          description:
            'Reserva tu sesión de grabación en línea de manera rápida y sencilla según tu disponibilidad.',
          isHovered: false,
        },
      ],
    };
  },
  methods: {
    // MÉTODOS

    /**
     * hoverFeature
     * Activa el estado `isHovered` de una característica específica cuando el cursor pasa sobre ella.
     * @param {number} id - ID de la característica.
     */
    hoverFeature(id) {
      const feature = this.features.find((f) => f.id === id); // Busca la característica por ID
      if (feature) feature.isHovered = true; // Cambia el estado a `true`
    },

    /**
     * unhoverFeature
     * Desactiva el estado `isHovered` de una característica específica cuando el cursor se retira.
     * @param {number} id - ID de la característica.
     */
    unhoverFeature(id) {
      const feature = this.features.find((f) => f.id === id); // Busca la característica por ID
      if (feature) feature.isHovered = false; // Cambia el estado a `false`
    },
  },
};
</script>
