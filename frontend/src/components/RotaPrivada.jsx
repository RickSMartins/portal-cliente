import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function RotaPrivada() {
  const { nome } = useAuth();

  if (!nome) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
