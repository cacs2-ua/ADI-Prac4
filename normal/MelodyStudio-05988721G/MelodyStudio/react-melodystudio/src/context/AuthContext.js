// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // OJO: Esta línea está bien, NO modificar según tus indicaciones

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    idToken: null,
  });

  // Nuevo estado de carga
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expirado
          logout();
        } else {
          setAuth({
            isAuthenticated: true,
            user: decoded,
            idToken: token,
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
    setLoadingAuth(false);
  }, []);

  const login = (idToken) => {
    localStorage.setItem('idToken', idToken);
    const decoded = jwtDecode(idToken);
    setAuth({
      isAuthenticated: true,
      user: decoded,
      idToken: idToken,
    });
  };

  const logout = () => {
    localStorage.removeItem('idToken');
    setAuth({
      isAuthenticated: false,
      user: null,
      idToken: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
