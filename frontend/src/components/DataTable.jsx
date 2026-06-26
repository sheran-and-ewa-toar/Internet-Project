import "../styles/DataTable.css";
import api from "../services/api";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

export default function DataTable({ jobs = [] }) {
    const [jobToDelete, setJobToDelete] = useState(null);
    if (!jobs.length) {
        return <div>No training jobs found.</div>;
}

const getStatusClass = (status) => {
    switch (status) {
        case "completed":
            return "status-completed";
        case "running":
            return "status-running";
        case "failed":
            return "status-failed";
        default:
            return "status-queued";
    }
};

const getFilterValue = (job, shortName) => {
    const filter = job.appliedFilters?.find(f => f.shortName === shortName);
    return filter?.JobFilter?.thresholdValue ?? "—";
};

const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
        await api.delete(`/api/jobs/${jobToDelete.jobId}`);
    } catch (err) {
        console.error("Failed to delete job", err);
    } finally {
        setJobToDelete(null);
    }
};

return (
    <div className="table-wrapper">
        <table className="data-table">
            <thead>
                <tr>
                    <th>Job</th>
                    <th>Status</th>
                    <th>Feature Set</th>
                    <th>Model</th>
                    <th>Pearson</th>
                    <th>Variance</th>
                    <th>Accuracy</th>
                    <th>Precision</th>
                    <th>Recall</th>
                    <th>F1</th>
                    <th>CV Mean</th>
                    <th>CV Std</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {jobs.map((job) => (
                    <tr key={job.jobId}>
                        <td>#{job.jobId}</td>

                        <td>
                            <span className={`status-badge ${getStatusClass(job.status)}`}>
                                {job.status || "queued"}
                            </span>
                        </td>

                        <td>{job.featureSetName}</td>
                        <td>{job.modelName}</td>

                        <td>{getFilterValue(job, "pearson")}</td>
                        <td>{getFilterValue(job, "variance")}</td>

                        <td>{job.accuracy ?? "-"}</td>
                        <td>{job.precision ?? "-"}</td>
                        <td>{job.recall ?? "-"}</td>
                        <td>{job.f1Score ?? "-"}</td>
                        <td>{job.cv_mean ?? "-"}</td>
                        <td>{job.cv_std ?? "-"}</td>

                        <td>
                            <button
                                className="delete-btn"
                                onClick={() => setJobToDelete(job)}
                            >
                                🗑️
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <ConfirmModal
            isOpen={!!jobToDelete}
            title="Delete Training Job"
            message={
                jobToDelete
                    ? `Are you sure you want to delete Job #${jobToDelete.jobId}?`
                    : ""
            }
            onConfirm={handleDelete}
            onCancel={() => setJobToDelete(null)}
        />
    </div>
);
}