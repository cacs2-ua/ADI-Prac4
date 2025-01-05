<template>
  <footer class="footer-section py-4 bg-dark text-white">
    <!-- 
    Este componente define el pie de página de la aplicación MelodyStudio.
    Proporciona información sobre la empresa, enlaces rápidos de navegación, y datos de contacto,
    además de incluir botones para redes sociales.
    -->
    <b-container>
      <b-row>
        <!-- Sección de información general -->
        <b-col md="4" class="mb-3">
          <h5>MelodyStudio</h5>
          <p>Tu espacio profesional para grabar maquetas y producciones musicales.</p>
        </b-col>
        
        <!-- Sección de enlaces rápidos -->
        <b-col md="4" class="mb-3">
          <h5>Enlaces Rápidos</h5>
          <ul class="list-unstyled">
            <!-- Enlaces de navegación utilizando `router-link` -->
            <li><router-link to="/" class="text-white">Inicio</router-link></li>
            <li><router-link to="/citas" class="text-white">Reservar Cita</router-link></li>
            <li><router-link to="/incidencias" class="text-white">Incidencias</router-link></li>
          </ul>
        </b-col>
        
        <!-- Sección de contacto -->
        <b-col md="4" class="mb-3">
          <h5>Contáctanos</h5>
          <p>Email: contacto@melodystudio.com</p> <!-- Dirección de correo -->
          <p>Teléfono: +34 123 456 789</p> <!-- Número de contacto -->
          <div>
            <!-- Botones para redes sociales -->
            <b-button href="#" variant="link" class="text-white">
              <i class="bi bi-facebook"></i>
            </b-button>
            <b-button href="#" variant="link" class="text-white">
              <i class="bi bi-twitter"></i>
            </b-button>
            <b-button href="#" variant="link" class="text-white">
              <i class="bi bi-instagram"></i>
            </b-button>
          </div>
        </b-col>
      </b-row>

      <!-- Sección de derechos reservados -->
      <b-row class="mt-3">
        <b-col class="text-center">
          <p>&copy; 2024 MelodyStudio. Todos los derechos reservados.</p>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>
