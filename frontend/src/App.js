import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext'; // Import NotificationProvider
import Login from './pages/Login';
import Logout from './pages/Logout';
import Dashboard from './pages/Dashboard';
import EmailManagement from './pages/EmailManagement';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './utils/ProtectedRoute';
import OrderListing from './pages/OrderManagement/OrderListing';
import OrderDetail from './pages/OrderManagement/OrderDetail'; // Adjust the path to your `OrderDetail` file
import './App.css';

function AppLayout() {
  const { pathname } = useLocation();

  const noNavbarRoutes = ['/login', '/logout'];

  return (
    <>
      {!noNavbarRoutes.includes(pathname) && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/email-management"
          element={
            <ProtectedRoute>
              <EmailManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-management"
          element={
            <ProtectedRoute>
              <OrderListing />
            </ProtectedRoute>
          }
        />
        {/* Correctly place the Route for OrderDetail here */}
        <Route
          path="/order-management/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!noNavbarRoutes.includes(pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppLayout />
      </NotificationProvider>
    </Router>
  );
}

export default App;
