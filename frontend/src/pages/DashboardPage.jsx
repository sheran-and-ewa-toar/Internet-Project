import { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/Card";

console.log("DASHBOARD RENDERED");

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);

                const res = await api.get("/api/jobs");

                setJobs(res.data.data || []);
            } catch (err) {
                setError("Failed to load jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    // last 3 jobs (most recent first)
    const recentJobs = [...jobs]
        .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
        .slice(0, 3);

    return (
        <div>
            <h2>Your Recent Training Runs</h2>

            {recentJobs.length === 0 ? (
                <p>No training runs found</p>
            ) : (
                recentJobs.map(job => (
                    <Card
                        key={job.jobId}
                        title={`Job #${job.jobId} (Model ${job.modelTypeId})`}
                        featureSetId={job.featureSetId}
                        accuracy={job.accuracy}
                        precision={job.precision}
                        recall={job.recall}
                        f1Score={job.f1Score}
                        date={job.createDate}
                    />
                ))
            )}
        </div>
    );
}