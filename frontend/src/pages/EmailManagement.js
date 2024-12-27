import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { NotificationContext } from '../contexts/NotificationContext'; // Import NotificationContext
import '../styles/EmailManagement.css';

const EmailManagement = () => {
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [reclassifyEmail, setReclassifyEmail] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [comments, setComments] = useState('');
  const { notify } = useContext(NotificationContext); // Use NotificationContext for notifications

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await api.get('/emails', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setEmails(response.data.data);
        setFilteredEmails(response.data.data);
        notify('success', 'Emails fetched successfully.');
      } catch (error) {
        console.error('Error fetching emails:', error);
        notify(
          'error',
          error.response?.data?.message || 'Failed to fetch emails. Please try again.'
        );
      }
    };

    fetchEmails();
  }, [notify]);

  const handleSearch = () => {
    const filtered = emails.filter((email) => {
      const matchesQuery = email.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? email.status === statusFilter : true;
      return matchesQuery && matchesStatus;
    });
    setFilteredEmails(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setStatusFilter('');
    setFilteredEmails(emails);
  };

  const handleView = (email) => {
    setSelectedEmail(email);
  };

  const handleCloseModal = () => {
    setSelectedEmail(null);
    setReclassifyEmail(null);
  };

  const handleReclassify = (email) => {
    setReclassifyEmail(email);
    setNewStatus('');
    setComments('');
  };

  const handleReclassifySubmit = async () => {
    if (!newStatus) {
      notify('error', 'Please select a new status.');
      return;
    }

    try {
      const response = await api.put(
        `/emails/${reclassifyEmail.id}/reclassify`,
        { newStatus, comments },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );

      notify('success', response.data.message);

      const updatedEmails = emails.map((email) =>
        email.id === reclassifyEmail.id
          ? { ...email, status: response.data.data.email.status }
          : email
      );
      setEmails(updatedEmails);
      setFilteredEmails(updatedEmails);
      setReclassifyEmail(null);
    } catch (error) {
      console.error('Error reclassifying email:', error);
      notify(
        'error',
        error.response?.data?.message || 'Failed to reclassify email. Please try again.'
      );
    }
  };

  const handleDelete = async (emailId) => {
    try {
      await api.delete(`/emails/${emailId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setFilteredEmails(filteredEmails.filter((email) => email.id !== emailId));
      notify('success', 'Email deleted successfully.');
    } catch (error) {
      console.error('Error deleting email:', error);
      notify(
        'error',
        error.response?.data?.message || 'Failed to delete email. Please try again.'
      );
    }
  };

  return (
    <div className="email-management-container">
      <h1>Email Management</h1>

      <div className="filters-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Order Email">Order Email</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Filtered Out">Filtered Out</option>
        </select>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <button className="search-button" onClick={handleClearSearch}>
          Clear
        </button>
      </div>

      <table className="email-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Sender</th>
            <th>Received At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmails.map((email) => (
            <tr key={email.id}>
              <td>{email.subject}</td>
              <td>{email.sender}</td>
              <td>{email.received_at}</td>
              <td>{email.status}</td>
              <td>
                <button className="view-button" onClick={() => handleView(email)}>
                  View
                </button>
                <button
                  className="reclassify-button"
                  onClick={() => handleReclassify(email)}
                >
                  Reclassify
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(email.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      {selectedEmail && (
        <div className="modal">
          <div className="modal-content">
            <h2>Email Details</h2>
            <button className="modal-close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <p><strong>Subject:</strong> {selectedEmail.subject}</p>
            <p><strong>Sender:</strong> {selectedEmail.sender}</p>
            <p><strong>To:</strong> {selectedEmail.to}</p>
            <p><strong>Received At:</strong> {selectedEmail.received_at}</p>
            <p><strong>Status:</strong> {selectedEmail.status}</p>
            <p><strong>Content:</strong></p>
            <div className="email-content">{selectedEmail.content || 'No content available.'}</div>
          </div>
        </div>
      )}

      {/* Reclassify Modal */}
      {reclassifyEmail && (
        <div className="modal">
          <div className="modal-content">
            <h2>Reclassify Email</h2>
            <button className="modal-close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <p><strong>Subject:</strong> {reclassifyEmail.subject}</p>
            <p><strong>Current Status:</strong> {reclassifyEmail.status}</p>
            <div>
              <label>
                <strong>New Status:</strong>
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select a status</option>
                <option value="Order Email">Order Email</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Filtered Out">Filtered Out</option>
                <option value="Fetched">Fetched</option>
                <option value="Confirmed Order Email">Confirmed Order Email</option>
              </select>
            </div>
            <div>
              <label>
                <strong>Comments:</strong>
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="3"
              />
            </div>
            <div className="modal-buttons">
              <button className="submit-button" onClick={handleReclassifySubmit}>
                Submit
              </button>
              <button className="cancel-button" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailManagement;
