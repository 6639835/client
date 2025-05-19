import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Loading from './ui/Loading';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <Loading size="large" text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    // Redirect to the login page with the current location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 