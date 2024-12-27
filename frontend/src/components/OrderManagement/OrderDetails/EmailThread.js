import React from "react";

const EmailThread = ({ emails }) => {
  if (!emails) {
    return <div>No emails available for this order.</div>;
  }

  return (
    <div className="email-thread-container">
      <div className="email-thread-item">
        <h4>{emails.subject}</h4>
        <p><strong>From:</strong> {emails.sender}</p>
        <p><strong>To:</strong> {emails.to}</p>
        <p><strong>Received At:</strong> {new Date(emails.received_at).toLocaleString()}</p>
        <div className="email-body">
          <p>{emails.content}</p>
        </div>
        <div className="attachments">
          <h5>Attachments:</h5>
          <p>No attachments available for this email.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailThread;
