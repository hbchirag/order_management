import React, { useContext } from "react";
import OrderService from "../../services/OrderService";
import { NotificationContext } from "../../contexts/NotificationContext";

const OrderTable = ({ orders, fetchOrders, onViewDetails }) => {
  const { notify } = useContext(NotificationContext);

  const handleMarkAsVerified = async (orderId) => {
    try {
      const response = await OrderService.verifyOrder(orderId);
      notify("success", response.message || "Order marked as verified.");
      fetchOrders();
    } catch (error) {
      notify("error", error.response?.data?.message || "Error verifying order.");
      console.error("Error verifying order:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await OrderService.cancelOrder(orderId);
      notify("success", response.message || "Order canceled.");
      fetchOrders();
    } catch (error) {
      notify("error", error.response?.data?.message || "Error canceling order.");
      console.error("Error canceling order:", error);
    }
  };

  return (
    <table className="order-table">
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Contact Email</th>
          <th>Received Date</th>
          <th>Loading Start Date</th>
          <th>Job Owner</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order.id}>
              <td>{order.customer?.name || "N/A"}</td>
              <td>{order.customer?.email || "N/A"}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                {order.loading_start_date
                  ? new Date(order.loading_start_date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{`${order.owner?.first_name} ${order.owner?.last_name}` || "N/A"}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => onViewDetails(order.id)}>View Details</button>
                <button onClick={() => handleMarkAsVerified(order.id)}>Mark as Verified</button>
                <button onClick={() => handleCancelOrder(order.id)}>Cancel</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">No orders found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OrderTable;
