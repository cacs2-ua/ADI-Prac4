import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Appointments = () => {
  const { logout } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchAppointments = async (pageToken = null) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/appointments', {
        params: {
          limit: 3, // Número de citas por página
          pageToken, // Token de la página actual
        },
      });

      // Eliminar duplicados basándonos en los IDs de las citas
      const newAppointments = res.data.citas;
      setAppointments((prevAppointments) => {
        const combined = [...prevAppointments, ...newAppointments];
        const uniqueAppointments = combined.filter(
          (appt, index, self) =>
            index === self.findIndex((t) => t.id === appt.id)
        );
        return uniqueAppointments;
      });

      setHasNextPage(res.data.hasNextPage);
      setNextPageToken(res.data.nextPageToken);
    } catch (err) {
      setError('Error al obtener las citas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      return;
    }
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt.id !== id)
      );
    } catch (err) {
      alert('Error al eliminar la cita.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h2 className="text-center my-4">Listado de Citas</h2>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>
        Cerrar Sesión
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No tienes citas programadas.
              </td>
            </tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.title}</td>
                <td>{appt.description}</td>
                <td>{new Date(appt.date).toLocaleDateString()}</td>
                <td>{appt.time}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(appt.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {hasNextPage && (
        <div className="text-center my-3">
          <button
            className="btn btn-primary"
            onClick={() => fetchAppointments(nextPageToken)}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cargar Más'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Appointments;
