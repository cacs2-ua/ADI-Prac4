// src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth, loadingAuth } = useContext(AuthContext);

  // Mientras se esté comprobando la autenticación, no hacemos nada
  if (loadingAuth) {
    // Podrías mostrar un spinner o texto de cargando
    return <p>Verificando sesión...</p>;
  }

  // Una vez verificado, si no está autenticado, redirige
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
