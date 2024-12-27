import React from "react";

const ActivityLogTable = ({ activityLog }) => {
  return (
    <div className="activity-log">
      <h3>Activity Log</h3>
      {activityLog.map((log, index) => (
        <div key={index} className="log-item">
          <p>{log.message}</p>
          <p>{new Date(log.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ActivityLogTable;
