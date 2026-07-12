import "../styles/DataTable.css";
import AiInsights from "./AiInsights";

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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                                    <AiInsights job={job} />
                                    <button
                                        className="delete-btn"
                                        onClick={() => onDeleteClick(job)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}