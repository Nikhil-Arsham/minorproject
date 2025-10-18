import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    if (onLogout) onLogout();
    navigate('/');
  };

  React.useEffect(() => {
    handleLogout();
  }, [navigate, onLogout]);

  return <div>Logging out...</div>; // Placeholder while redirecting
};

export default Logout;