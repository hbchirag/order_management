import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderTable from '../../components/OrderManagement/OrderTable';
import OrderFilters from '../../components/OrderManagement/OrderFilters';
import OrderService from '../../services/OrderService';
import { NotificationContext } from '../../contexts/NotificationContext'; // Import NotificationContext
import '../../styles/OrderManagement.css';

const OrderListing = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: '', jobOwner: '', search: '' });
  const navigate = useNavigate(); // React Router hook for navigation
  const { notify } = useContext(NotificationContext); // Use NotificationContext

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      const response = await OrderService.getOrders(filters);
      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data); // Safely set the data as an array
        notify('success', 'Orders fetched successfully.'); // Notify success
      } else {
        setOrders([]); // Fallback to an empty array
        notify('warning', 'No orders found.'); // Notify warning
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Fallback to an empty array in case of an error
      notify('error', error.response?.data?.message || 'Error fetching orders.'); // Notify error
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', jobOwner: '', search: '' }); // Reset all filters
    notify('info', 'Filters cleared.'); // Notify filter reset
  };

  // Function to navigate to the OrderDetail page
  const handleViewDetails = (orderId) => {
    navigate(`/order-management/${orderId}`);
  };

  return (
    <div className="order-management-container">
      <h1>Order Management</h1>
      <OrderFilters filters={filters} setFilters={setFilters} clearFilters={clearFilters} />
      <OrderTable orders={orders} fetchOrders={fetchOrders} onViewDetails={handleViewDetails} />
    </div>
  );
};

export default OrderListing;
