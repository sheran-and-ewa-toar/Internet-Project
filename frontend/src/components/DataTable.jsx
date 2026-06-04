import "../styles/DataTable.css";

export default function DataTable({ jobs = [] }) {
    if (!jobs.length) {
        return (
            <div className="table-empty">
                No training jobs found.
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Job</th>
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

                            <td>{job.featureSetName || job.featureSetId}</td>

                            <td>{job.modelName || job.modelTypeId}</td>

                            <td>
                                {job.pearsonEnabled
                                    ? `(${job.pearsonThreshold}`
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