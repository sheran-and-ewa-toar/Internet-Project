import "../styles/DataTable.css";

export default function DataTable({ jobs = [] }) {
    if (!jobs.length) {
        return <p>No training jobs found.</p>;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "#2e7d32";
            case "running":
                return "#1565c0";
            case "failed":
                return "#c62828";
            default:
                return "#ef6c00";
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
                        <th>F1</th>
                        <th>CV Mean</th>
                        <th>CV Std</th>
                    </tr>
                </thead>

                <tbody>
                    {jobs.map(job => (
                        <tr key={job.jobId}>

                            <td className="job-id">#{job.jobId}</td>

                            <td>
                                <span
                                    style={{
                                        color: "white",
                                        background: getStatusColor(job.status),
                                        padding: "3px 8px",
                                        borderRadius: "10px",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        textTransform: "uppercase"
                                    }}
                                >
                                    {job.status || "queued"}
                                </span>
                            </td>

                            <td>{job.featureSetName || job.featureSetId}</td>

                            <td>{job.modelName || job.modelTypeId}</td>

                            <td>
                                {job.pearsonEnabled
                                    ? `${job.pearsonThreshold}`
                                    : "—"}
                            </td>

                            <td>
                                {job.varianceEnabled
                                    ? `${job.varianceThreshold}`
                                    : "—"}
                            </td>

                            <td>{job.accuracy ?? "-"}</td>
                            <td>{job.f1Score ?? "-"}</td>
                            <td>{job.cv_mean ?? "-"}</td>
                            <td>{job.cv_std ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}