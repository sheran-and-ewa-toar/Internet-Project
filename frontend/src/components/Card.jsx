import "../styles/Card.css";
import api from "../services/api";
import { useState } from "react";

export default function Card({ job, onDelete }) {
    const [loading, setLoading] = useState(false);

    if (!job) return null;

    const status = job.status || "queued";

    const getFilterValue = (shortName) => {
        const filter = job.appliedFilters?.find(f => f.shortName === shortName);
        return filter?.JobFilter?.thresholdValue ?? null;
    };

    const pearsonThreshold = getFilterValue("pearson");
    const varianceThreshold = getFilterValue("variance");

    const safe = (v) => v ?? "-";

    const handleDelete = async () => {
        const ok = window.confirm(`Delete Job #${job.jobId}?`);
        if (!ok) return;

        try {
            setLoading(true);
            await api.delete(`/api/jobs/${job.jobId}`);
            onDelete?.(job.jobId); // notify parent to refresh UI
        } catch (err) {
            console.error("Failed to delete job", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="job-card">

            <div className="job-card-header">
                <h3>Job #{job.jobId}</h3>

                <div className="job-meta">
                    <span className="job-date">
                        {new Date(job.createDate).toLocaleDateString()}
                    </span>

                    <span className={`status-badge ${status}`}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="card-section">
                <h4>Configuration</h4>

                <p><strong>Feature Set:</strong> {job.featureSetName}</p>
                <p><strong>Model:</strong> {job.modelName}</p>

                <p>
                    <strong>Pearson Filter:</strong>{" "}
                    {pearsonThreshold !== null ? pearsonThreshold : "Disabled"}
                </p>

                <p>
                    <strong>Variance Filter:</strong>{" "}
                    {varianceThreshold !== null ? varianceThreshold : "Disabled"}
                </p>
            </div>

            <div className="card-section">
                <h4>Results</h4>

                <p><strong>Accuracy:</strong> {safe(job.accuracy)}</p>
                <p><strong>Precision:</strong> {safe(job.precision)}</p>
                <p><strong>Recall:</strong> {safe(job.recall)}</p>
                <p><strong>F1 Score:</strong> {safe(job.f1Score)}</p>
                <p><strong>CV Mean:</strong> {safe(job.cv_mean)}</p>
                <p><strong>CV Std:</strong> {safe(job.cv_std)}</p>
            </div>

            {status === "failed" && (
                <div className="job-error">
                    <strong>Job failed:</strong>
                    <div>{job.error || "Unknown error"}</div>
                </div>
            )}

            {status === "running" && (
                <div className="job-running">
                    🔄 Training model...
                </div>
            )}

            <button
                className="delete-btn"
                onClick={handleDelete}
                disabled={loading}
            >
                {loading ? "Deleting..." : "🗑 Delete"}
            </button>

        </div>
    );
}