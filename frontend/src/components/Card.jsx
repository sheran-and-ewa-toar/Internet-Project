import "../styles/Card.css";

export default function Card({ job }) {
    if (!job) return null;

    const getStatusStyle = (status) => {
        switch (status) {
            case "completed":
                return { background: "#2e7d32", color: "white" };
            case "running":
                return { background: "#1565c0", color: "white" };
            case "failed":
                return { background: "#c62828", color: "white" };
            default:
                return { background: "#ef6c00", color: "white" };
        }
    };

    return (
        <div className="job-card">

            <div className="job-card-header">
                <h3>Job #{job.jobId}</h3>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span className="job-date">
                        {new Date(job.createDate).toLocaleDateString()}
                    </span>

                    <span style={{
                        ...getStatusStyle(job.status),
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textTransform: "uppercase"
                    }}>
                        {job.status || "queued"}
                    </span>
                </div>
            </div>

            <div className="card-section">
                <h4>Configuration</h4>

                <p><strong>Feature Set:</strong> {job.featureSetName}</p>
                <p><strong>Model:</strong> {job.modelName}</p>

                <p>
                    <strong>Pearson Filter:</strong>{" "}
                    {job.pearsonEnabled ? job.pearsonThreshold : "Disabled"}
                </p>

                <p>
                    <strong>Variance Filter:</strong>{" "}
                    {job.varianceEnabled ? job.varianceThreshold : "Disabled"}
                </p>
            </div>

            <div className="card-section">
                <h4>Results</h4>

                <p><strong>Accuracy:</strong> {job.accuracy ?? "-"}</p>
                <p><strong>Precision:</strong> {job.precision ?? "-"}</p>
                <p><strong>Recall:</strong> {job.recall ?? "-"}</p>
                <p><strong>F1 Score:</strong> {job.f1Score ?? "-"}</p>
                <p><strong>CV Mean:</strong> {job.cv_mean ?? "-"}</p>
                <p><strong>CV Std:</strong> {job.cv_std ?? "-"}</p>
            </div>

            {job.status === "failed" && (
                <div style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#ffebee",
                    color: "#b71c1c",
                    borderRadius: "6px",
                    fontSize: "12px"
                }}>
                    <strong>Job failed:</strong>
                    <div>{job.error || "Unknown error"}</div>
                </div>
            )}

            {job.status === "running" && (
                <div style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "#1565c0"
                }}>
                    🔄 Training model...
                </div>
            )}

        </div>
    );
}