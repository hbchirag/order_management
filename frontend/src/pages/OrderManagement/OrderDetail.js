import React, { useState, useEffect, useContext } from "react";
import OrderHeader from "../../components/OrderManagement/OrderDetails/OrderHeader";
import JobDetails from "../../components/OrderManagement/OrderDetails/JobDetails";
import Attachments from "../../components/OrderManagement/OrderDetails/Attachments";
import EmailThread from "../../components/OrderManagement/OrderDetails/EmailThread";
import ActivityLogTable from "../../components/OrderManagement/ActivityLog/ActivityLogTable";
import OrderDetailButtons from "../../components/OrderManagement/OrderDetailButtons";
import OrderService from "../../services/OrderService";
import { NotificationContext } from "../../contexts/NotificationContext";
import "../../styles/OrderDetail.css";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [orderData, setOrderData] = useState({});
  const [editableFields, setEditableFields] = useState({});
  const [loading, setLoading] = useState(true);
  const { notify } = useContext(NotificationContext);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await OrderService.getOrderById(orderId);
      setOrderData(response.data || {});
      setEditableFields({
        customerName: response.data.customer?.name || "",
        customerOrderRef: response.data.customer_order_ref || "",
        currency: response.data.currency || "USD",
        notes: "",
      });
      notify("success", "Order details fetched successfully.");
    } catch (error) {
      notify("error", "Error fetching order details.");
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        customerName: editableFields.customerName,
        customerOrderRef: editableFields.customerOrderRef,
        currency: editableFields.currency,
        notes: editableFields.notes,
      };

      const response = await OrderService.updateOrder(orderId, updatedData);
      setOrderData({ ...orderData, ...response.data });
      notify("success", "Order details updated successfully.");
    } catch (error) {
      notify("error", "Failed to save changes.");
      console.error("Error saving changes:", error);
    }
  };

  const handleAction = async (action) => {
    try {
      if (action === "markAsVerified") {
        const response = await OrderService.markAsVerified(orderId);
        setOrderData({ ...orderData, status: "Verified" });
        notify("success", response.message || "Order marked as verified.");
      } else if (action === "cancelOrder") {
        const response = await OrderService.cancelOrder(orderId);
        setOrderData({ ...orderData, status: "Cancelled" });
        notify("success", response.message || "Order canceled.");
      }
    } catch (error) {
      notify("error", `Error performing ${action}.`);
      console.error(`Error performing ${action}:`, error);
    }
  };

  if (loading) {
    return <div>Loading order details...</div>;
  }

  const { jobs, attachments, emails, statusLogs, extractedFields, status } =
    orderData;

  return (
    <div className="order-detail-container">
      <OrderHeader
        status={status}
        extractedFields={extractedFields}
        onSave={handleSaveChanges}
      />
      <div className="tabs">
        <button
          className={activeTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
        >
          Order Details
        </button>
        <button
          className={activeTab === "log" ? "active" : ""}
          onClick={() => setActiveTab("log")}
        >
          Activity Log
        </button>
      </div>
      {activeTab === "details" && (
        <div className="order-details-section">
          {/* Editable Fields */}
          <div className="field">
            <label>Customer Name:</label>
            <input
              type="text"
              value={editableFields.customerName}
              onChange={(e) => handleFieldChange("customerName", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Customer Ref No.:</label>
            <input
              type="text"
              value={editableFields.customerOrderRef}
              onChange={(e) =>
                handleFieldChange("customerOrderRef", e.target.value)
              }
            />
          </div>
          <div className="field">
            <label>Currency:</label>
            <select
              value={editableFields.currency}
              onChange={(e) => handleFieldChange("currency", e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="field">
            <label>Notes:</label>
            <textarea
              value={editableFields.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
            />
          </div>

          {/* Job Details */}
          <JobDetails jobs={jobs} editable onJobUpdate={fetchOrderDetails} />
          <Attachments attachments={attachments} />
          <OrderDetailButtons
            orderData={orderData}
            onAction={handleAction}
            refreshOrder={fetchOrderDetails}
          />
        </div>
      )}
      {activeTab === "log" && <ActivityLogTable activityLog={statusLogs} />}
      <EmailThread emails={emails} />
    </div>
  );
};

export default OrderDetail;
