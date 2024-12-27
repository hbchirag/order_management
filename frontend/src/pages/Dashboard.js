import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { NotificationContext } from '../contexts/NotificationContext'; // Import NotificationContext
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const { notify } = useContext(NotificationContext); // Use NotificationContext

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setUser(response.data.data);
        notify('success', 'User data fetched successfully.'); // Notify success
      } catch (err) {
        console.error('Error fetching user data:', err);
        notify('error', err.response?.data?.message || 'Error fetching user data.'); // Notify error
      } finally {
        setLoading(false); // Stop loading after request completion
      }
    };

    fetchUserData();
  }, [notify]);

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while data is being fetched
  }

  if (!user) {
    return <p>No user data available.</p>; // Fallback if user data is not set
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.first_name} {user.last_name}</h1>
        <p>Email: {user.email}</p>
        <p>Role: {user.role_name}</p>
      </div>
      <div className="dashboard-permissions">
        <h2>Permissions:</h2>
        {user.permissions && user.permissions.length > 0 ? (
          <ul>
            {user.permissions.map((perm, index) => (
              <li key={index}>{perm.description}</li>
            ))}
          </ul>
        ) : (
          <p>No permissions assigned.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
