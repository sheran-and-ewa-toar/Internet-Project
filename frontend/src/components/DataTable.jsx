export default function DataTable({ jobs = [] }) {

    if (!jobs.length) {
        return <p>No training jobs found.</p>;
    }

    return (
        <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", marginTop: "16px" }}
        >
            <thead>
                <tr>
                    <th>Job ID</th>
                    <th>Feature Set</th>
                    <th>Model Type</th>
                    <th>Pearson</th>
                    <th>Variance</th>
                    <th>Accuracy</th>
                    <th>Precision</th>
                    <th>Recall</th>
                    <th>F1</th>
                    <th>CV Mean</th>
                    <th>CV Std</th>
                </tr>
            </thead>

            <tbody>
                {jobs.map(job => (
                    <tr key={job.jobId}>
                        <td>{job.jobId}</td>
                        <td>{job.featureSetId}</td>
                        <td>{job.modelTypeId}</td>

                        <td>
                            {job.pearsonEnabled
                                ? job.pearsonThreshold
                                : "No"}
                        </td>

                        <td>
                            {job.varianceEnabled
                                ? job.varianceThreshold
                                : "No"}
                        </td>

                        <td>{job.accuracy ?? "-"}</td>
                        <td>{job.precision ?? "-"}</td>
                        <td>{job.recall ?? "-"}</td>
                        <td>{job.f1Score ?? "-"}</td>
                        <td>{job.cv_mean ?? "-"}</td>
                        <td>{job.cv_std ?? "-"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}