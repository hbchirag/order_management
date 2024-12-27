import React, { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";

const Filters = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, handleSearch }) => {
  const { notify } = useContext(NotificationContext);

  const handleApplyFilters = () => {
    if (!searchQuery && !statusFilter) {
      notify("info", "Please provide search criteria or select a status.");
    } else {
      handleSearch();
    }
  };

  return (
    <div className="filters-container">
      <input
        type="text"
        placeholder="Search by subject, sender, or content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="status-filter"
      >
        <option value="">All Statuses</option>
        <option value="Fetched">Fetched</option>
        <option value="Filtered Out">Filtered Out</option>
        <option value="Pending Review">Pending Review</option>
        <option value="Confirmed Order Email">Confirmed Order Email</option>
        <option value="Order Email">Order Email</option>
      </select>
      <button onClick={handleApplyFilters} className="search-button">
        Search
      </button>
    </div>
  );
};

export default Filters;
