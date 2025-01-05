import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { email, password, displayName } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const endpoint = '/auth/signup-client'; // Registro para clientes
      const payload = { email, password, displayName };

      await api.post(endpoint, payload);
      setSuccess('Registro exitoso. Puedes iniciar sesión ahora.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 'Error al registrarse. Inténtalo de nuevo.'
      );
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow w-50">
        <h2 className="text-center mb-4">Registro de Usuario</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre de Usuario:</label>
            <input
              type="text"
              name="displayName"
              value={displayName}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Registrarse
          </button>
        </form>
        <p className="text-center mt-3">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
