// app.js

const express = require('express');
const cors = require('cors'); // Importar el paquete CORS
const app = express();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');
const appointmentRoutes = require('./routes/appointments');
const googleOAuthRoutes = require('./routes/GoogleOAuthRoutes');
const session = require('express-session');
const passport = require('passport');
const incidenciasRouter = require('./routes/incidencias');
const adminAppointmentsRoutes = require('./routes/admin/appointments');
const adminIncidenciasRoutes = require('./routes/admin/incidencias');
require('./services/GoogleOAuthServices');

// Middleware para habilitar CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Permitir solicitudes desde estos orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  credentials: true, // Permitir envío de cookies y encabezados de autenticación
}));

app.use(express.json());

// Configurar sesiones
app.use(session({
  secret: 'vitalsanity_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/resources', resourceRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/incidencias', incidenciasRouter);
app.use('/', googleOAuthRoutes);
app.use('/admin/appointments', adminAppointmentsRoutes);
app.use('/admin/incidencias', adminIncidenciasRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
