import { useEffect, useState } from "react";
import api from "../services/api";

import Card from "../components/Card";
import DataTable from "../components/DataTable";

export default function Dashboard() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchJobs = async () => {

            try {

                const res = await api.get("/api/jobs");

                setJobs(res.data.data);

            } catch (err) {

                setError(
                    err.response?.data?.error?.message ||
                    "Failed to load jobs"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchJobs();

    }, []);

    if (loading) {
        return <p>Loading jobs...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Dashboard</h2>

            {jobs.length === 0 && (
                <p>No training jobs found.</p>
            )}

            {jobs.slice(0, 3).map((job) => (
                <Card
                    key={job.jobId}
                    title={`Job ${job.jobId}`}
                    description={`Accuracy: ${job.accuracy}`}
                />
            ))}

            <h3>Training Jobs</h3>

            <DataTable data={jobs} />
        </div>
    );
}