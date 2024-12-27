import React from "react";

const Attachments = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return <div>No attachments available for this order.</div>;
  }

  return (
    <div className="attachments">
      <h3>Attachments</h3>
      {attachments.map((attachment) => (
        <div key={attachment.id} className="attachment-item">
          <p>{attachment.file_path.split("/").pop()}</p>
          <button onClick={() => window.open(attachment.file_path, "_blank")}>
            Preview
          </button>
          <button
            onClick={() => (window.location.href = attachment.file_path)}
          >
            Download
          </button>
        </div>
      ))}
    </div>
  );
};

export default Attachments;
