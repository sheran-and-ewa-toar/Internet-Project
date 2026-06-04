import "../styles/Card.css";

export default function Card({ job }) {
    if (!job) return null;

    return (
        <div className="job-card">

            <div className="job-card-header">
                <h3>Job #{job.jobId}</h3>

                <span className="job-date">
                    {new Date(job.createDate).toLocaleDateString()}
                </span>
            </div>

            <div className="card-section">
                <h4>Configuration</h4>

                <p>
                    <strong>Feature Set:</strong> {job.featureSetName}
                </p>

                <p>
                    <strong>Model:</strong> {job.modelName}
                </p>

                <p>
                    <strong>Pearson Filter:</strong>{" "}
                    {job.pearsonEnabled
                        ? job.pearsonThreshold
                        : "Disabled"}
                </p>

                <p>
                    <strong>Variance Filter:</strong>{" "}
                    {job.varianceEnabled
                        ? job.varianceThreshold
                        : "Disabled"}
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

        </div>
    );
}