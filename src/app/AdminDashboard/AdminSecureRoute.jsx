import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { useAdmin } from '../../Context/AdminContextProvider';

function AdminSecureRoute({ children }) {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }

  return isAdmin ? children : <Navigate to="/app" replace />;
}

export default AdminSecureRoute;
