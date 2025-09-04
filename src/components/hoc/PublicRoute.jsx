import React from 'react'
import useUserInfo from '../../hooks/useUserInfo';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { token } = useUserInfo();
  return (
    token ?  <Navigate to="/home" /> : children
  );
}

export default PublicRoute
