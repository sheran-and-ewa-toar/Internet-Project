import "../styles/DataTable.css";

export default function DataTable({ jobs = [], onDeleteClick }) {
    if (!jobs.length) {
        return <p>No training jobs found.</p>;
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
        const filter = job.appliedFilters?.find(
            f => f.shortName === shortName
        );
        return filter?.JobFilter?.thresholdValue ?? "—";
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
                                    onClick={() => onDeleteClick(job)}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}