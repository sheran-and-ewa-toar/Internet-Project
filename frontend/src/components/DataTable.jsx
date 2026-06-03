export default function DataTable({ jobs }) {

    if (!jobs.length) {
        return <p>No training jobs found.</p>;
    }

    return (
        <table border="1" cellPadding="8">
            <thead>
                <tr>
                    <th>Job ID</th>
                    <th>Feature Set</th>
                    <th>Model Type</th>
                    <th>Filter</th>
                    <th>Accuracy</th>
                </tr>
            </thead>

            <tbody>
                {jobs.map(job => (
                    <tr key={job.jobId}>
                        <td>{job.jobId}</td>
                        <td>{job.featureSetId}</td>
                        <td>{job.modelTypeId}</td>
                        <td>{job.filterId}</td>
                        <td>{job.accuracy}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}