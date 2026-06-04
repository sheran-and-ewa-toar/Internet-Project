export default function Card({ job }) {
    if (!job) return null;
    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                backgroundColor: "#fff"
            }}
        >
            <h3 style={{ marginTop: 0 }}>
                Job #{job.jobId}
            </h3>

            <small style={{ color: "#666" }}>
                Created: {new Date(job.createDate).toLocaleString()}
            </small>

            <hr />

            {/* CONFIGURATION */}
            <h4>Configuration</h4>

            <p><b>Feature Set ID:</b> {job.featureSetId}</p>
            <p><b>Model Type ID:</b> {job.modelTypeId}</p>

            <p>
                <b>Pearson:</b>{" "}
                {job.pearsonEnabled
                    ? `Enabled (${job.pearsonThreshold})`
                    : "Disabled"}
            </p>

            <p>
                <b>Variance:</b>{" "}
                {job.varianceEnabled
                    ? `Enabled (${job.varianceThreshold})`
                    : "Disabled"}
            </p>

            <hr />

            {/* RESULTS */}
            <h4>Results</h4>

            <p><b>Accuracy:</b> {job.accuracy ?? "-"}</p>
            <p><b>Precision:</b> {job.precision ?? "-"}</p>
            <p><b>Recall:</b> {job.recall ?? "-"}</p>
            <p><b>F1 Score:</b> {job.f1Score ?? "-"}</p>

            <p><b>CV Mean:</b> {job.cv_mean ?? "-"}</p>
            <p><b>CV Std:</b> {job.cv_std ?? "-"}</p>
        </div>
    );
}