import React from "react";

const JobDetails = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return <div>No jobs available for this order.</div>;
  }

  return (
    <div className="job-details">
      {jobs.map((job, index) => (
        <div key={job.id} className="job-item">
          <h4>Job {index + 1}</h4>
          <div className="field">
            <label>Task Description:</label>
            <span>{job.task_description}</span>
          </div>
          <div className="field">
            <label>Address:</label>
            <span>{job.address}</span>
          </div>
          <div className="field">
            <label>Fixed Time:</label>
            <span>{job.time_is_fixed ? "Yes" : "No"}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobDetails;
