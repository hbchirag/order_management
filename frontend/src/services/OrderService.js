import api from './api';

const OrderService = {
  getOrders: (filters) => api.get('/orders', { params: filters }),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  verifyOrder: (orderId) => api.put(`/orders/${orderId}/verify`),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
  saveOrder: (orderId, updatedData) => api.put(`/orders/${orderId}`, updatedData),
  addJob: (orderId, jobData) => api.post(`/orders/${orderId}/jobs`, jobData),
};

export default OrderService;