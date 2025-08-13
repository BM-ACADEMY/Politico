import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ allowedRole, children }) => {
  const { user, loading } = useContext(AuthContext);
  console.log('PrivateRoute - User:', user, 'Loading:', loading, 'AllowedRole:', allowedRole);

  if (loading) {
    console.log('PrivateRoute - Rendering loading state');
    return <div>Loading...</div>;
  }

  const isAuthenticated = !!user;
  const userRole = user?.role?.name;
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated, 'userRole:', userRole);

  const validRoles = ['admin', 'sub_admin', 'candidate_manager', 'area_manager', 'volunteer'];

  if (isAuthenticated && (allowedRole === 'login' || allowedRole === 'public')) {
    console.log('PrivateRoute - Redirecting to:', `/${userRole}_dashboard`);
    return <Navigate to={`/${userRole}_dashboard`} replace />;
  }

  if (!isAuthenticated && (allowedRole === 'login' || allowedRole === 'public')) {
    console.log('PrivateRoute - Rendering children for public/login route');
    return children;
  }

  if (isAuthenticated && !validRoles.includes(allowedRole)) {
    console.log('PrivateRoute - Invalid allowedRole, redirecting to:', `/${userRole}_dashboard`);
    return <Navigate to={`/${userRole}_dashboard`} replace />;
  }

  if (isAuthenticated && allowedRole !== userRole) {
    console.log('PrivateRoute - Redirecting to:', `/${userRole}_dashboard`);
    return <Navigate to={`/${userRole}_dashboard`} replace />;
  }

  if (isAuthenticated && allowedRole === userRole) {
    console.log('PrivateRoute - Rendering children for protected route');
    return children;
  }

  console.log('PrivateRoute - Redirecting to:', `/${allowedRole}-login`);
  return <Navigate to={`/${allowedRole}-login`} replace />;
};

export default PrivateRoute;