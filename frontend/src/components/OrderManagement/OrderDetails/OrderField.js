import React from "react";

const OrderField = ({ order }) => {
  return (
    <div className="order-fields">
      <div className="field">
        <label>Customer Name:</label>
        <span>{order.customer?.name || "N/A"}</span>
      </div>
      <div className="field">
        <label>Customer Email:</label>
        <span>{order.customer?.email || "N/A"}</span>
      </div>
      <div className="field">
        <label>Status:</label>
        <span>{order.status || "N/A"}</span>
      </div>
    </div>
  );
};

export default OrderField;
