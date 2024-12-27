import React from "react";
import "../../../styles/OrderDetail.css";

const OrderHeader = ({ status, extractedFields }) => {
  const progress =
    (extractedFields?.extracted / extractedFields?.total || 0) * 100;

  return (
    <div className="order-header">
      <h2>Order Detail</h2>
      <div className={`status-badge ${status?.toLowerCase().replace(" ", "-")}`}>
        {status}
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
      <p>
        Extracted Fields: {extractedFields?.extracted || 0}/
        {extractedFields?.total || 0}
      </p>
    </div>
  );
};

export default OrderHeader;
