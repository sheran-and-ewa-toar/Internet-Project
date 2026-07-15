import "../styles/Card.css";

export default function Card({ job, onDeleteClick }) {
    if (!job) return null;

    const status = job.status || "queued";

    const getFilterValue = (shortName) => {
        const filter = job.appliedFilters?.find(
            f => f.shortName === shortName
        );
        return filter?.JobFilter?.thresholdValue ?? null;
    };

    const pearsonThreshold = getFilterValue("pearson");
    const varianceThreshold = getFilterValue("variance");

    const safe = (v) => v ?? "-";

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
                    <div>{job.error || "ML-Service failed"}</div>
                </div>
            )}

            {status === "running" && (
                <div className="job-running" role="status" aria-live="polite">
                    <span className="job-spinner" aria-hidden="true"></span>
                    <span>Training model...</span>
                </div>
            )}

            <button
                className="delete-btn"
                onClick={() => onDeleteClick(job)}
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Delete
            </button>

        </div>
    );
}