import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Watch out for the 'e' and 'z' swap here depending on your localStorage setup
  const isLoggedIn = localStorage.getItem('royneza_admin_logged_in');
  
  if (!isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

export default ProtectedRoute;