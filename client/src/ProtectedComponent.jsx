import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from './utils/cookiesApi';
const ProtectedRouteComponent = () => {
  const token = getCookie('user_token');
  const isAuthenticated = !!token;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRouteComponent;
