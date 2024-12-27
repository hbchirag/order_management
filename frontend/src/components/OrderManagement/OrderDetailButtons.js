import React from "react";
import OrderService from "../../services/OrderService";
import { useContext } from "react";
import { NotificationContext } from "../../contexts/NotificationContext";

const OrderDetailButtons = ({ orderData, refreshOrder }) => {
  const { notify } = useContext(NotificationContext); // Use NotificationContext for notifications

  const handleAction = async (action) => {
    try {
      if (action === "markAsVerified") {
        const response = await OrderService.verifyOrder(orderData.id);
        notify("success", response.message || "Order marked as verified.");
      } else if (action === "cancelOrder") {
        const response = await OrderService.cancelOrder(orderData.id);
        notify("success", response.message || "Order canceled.");
      }
      refreshOrder(); // Refresh the order details after the action
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message || `Error performing ${action}.`
      );
      console.error(`Error performing ${action}:`, error);
    }
  };

  return (
    <div className="order-buttons">
      {orderData.status === "Ready for Review" && (
        <button onClick={() => handleAction("markAsVerified")}>
          Mark as Verified
        </button>
      )}
      {["Unprocessed", "Missing Info", "Ready for Review"].includes(
        orderData.status
      ) && (
        <button onClick={() => handleAction("cancelOrder")}>Cancel</button>
      )}
    </div>
  );
};

export default OrderDetailButtons;
