import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { NotificationContext } from '../contexts/NotificationContext'; // Import NotificationContext
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { notify } = useContext(NotificationContext); // Use NotificationContext for notifications
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable the login button during the request

    if (!email || !password) {
      notify('error', 'Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('authToken', response.data.data.token);
      notify('success', 'Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      notify(
        'error',
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome back</h2>
      <p>Enter your credentials to access your account</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading} // Disable input while loading
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading} // Disable input while loading
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
