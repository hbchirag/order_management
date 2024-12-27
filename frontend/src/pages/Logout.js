import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { NotificationContext } from '../contexts/NotificationContext'; // Import NotificationContext

const Logout = () => {
  const navigate = useNavigate();
  const { notify } = useContext(NotificationContext); // Use NotificationContext for notifications

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          await api.post('/auth/logout', null, {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.removeItem('authToken');
          notify('success', 'Logged out successfully!');
        }
      } catch (err) {
        console.error('Error logging out:', err);
        notify('error', 'Error logging out. Please try again.');
      } finally {
        navigate('/login');
      }
    };

    logout();
  }, [navigate, notify]);

  return <p>Logging out...</p>;
};

export default Logout;
