<!-- Frontend/src/views/HomeView.vue -->

<!--
Este archivo define la vista principal de la aplicación, conocida como "Home".
Integra diferentes secciones como el encabezado principal, características destacadas, testimonios de clientes, formulario de contacto y el pie de página.
-->

<template>
  <div>
    <!-- Sección principal de bienvenida -->
    <HeroSection />
    <!-- Sección de características destacadas -->
    <Features />
    <!-- Sección de testimonios -->
    <Testimonials />
    <!-- Sección de contacto -->
    <Contact />
    <!-- Pie de página -->
    <Footer />
  </div>
</template>

<script>
// Importa los componentes que conforman las distintas secciones de la página de inicio
import HeroSection from '@/components/home/HeroSection.vue';
import Features from '@/components/home/Features.vue';
import Testimonials from '@/components/home/Testimonials.vue';
import Contact from '@/components/home/Contact.vue';
import Footer from '@/components/home/Footer.vue';

export default {
  name: 'HomeView', // Nombre del componente principal
  components: {
    HeroSection, // Componente para la sección principal
    Features, // Componente para mostrar características destacadas
    Testimonials, // Componente para mostrar testimonios de clientes
    Contact, // Componente para el formulario de contacto
    Footer, // Componente para el pie de página
  },
};
</script>

<style scoped>
/* Puedes agregar estilos globales específicos para la HomePage aquí si es necesario */
</style>

<!--
EVENTOS GENERADOS:
- Este componente no genera eventos directamente, pero los componentes importados pueden generar eventos específicos como clics, envíos de formularios, etc.

VARIABLES Y MÉTODOS:
- `HeroSection`: Muestra una sección visual de bienvenida con un botón para iniciar acciones específicas.
- `Features`: Muestra una lista de características destacadas de la aplicación o servicio.
- `Testimonials`: Muestra testimonios de clientes o usuarios.
- `Contact`: Muestra un formulario para que los usuarios puedan enviar mensajes de contacto.
- `Footer`: Muestra el pie de página con enlaces y datos de contacto.

El componente "HomeView" sirve como contenedor para todas estas secciones y permite que sean mostradas juntas como una sola página.
-->
