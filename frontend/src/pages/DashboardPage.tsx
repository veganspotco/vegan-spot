import React, { useEffect } from 'react';
import { useAuth } from '../components/context/authContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al login si no está autenticado
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  return <Dashboard user={user!} onLogout={handleLogout} />;
};

export default DashboardPage;