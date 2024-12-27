import React, { useContext } from "react";
import { NotificationContext } from "../../contexts/NotificationContext";

const OrderFilters = ({ filters, setFilters, clearFilters }) => {
  const { notify } = useContext(NotificationContext);

  // Provide default values if `filters` or its properties are undefined
  const safeFilters = filters || { search: "", status: "" };

  const handleFilterChange = (e) => {
    setFilters({ ...safeFilters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    if (!safeFilters.search && !safeFilters.status) {
      notify("info", "Please provide search criteria or select a status.");
    } else {
      setFilters({ ...safeFilters });
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    setFilters({ search: "", status: "" });
    notify("success", "Filters cleared.");
  };

  return (
    <div className="filters-container">
      <input
        type="text"
        name="search"
        className="search-input"
        placeholder="Search by Customer, Order ID, etc."
        value={safeFilters.search}
        onChange={handleFilterChange}
      />
      <select
        name="status"
        className="status-filter"
        value={safeFilters.status}
        onChange={handleFilterChange}
      >
        <option value="">All Statuses</option>
        <option value="Unprocessed">Unprocessed</option>
        <option value="Missing Info">Missing Info</option>
        <option value="Ready for Review">Ready for Review</option>
        <option value="Verified">Verified</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
      <button className="clear-button" onClick={handleClearFilters}>
        Clear
      </button>
    </div>
  );
};

export default OrderFilters;
