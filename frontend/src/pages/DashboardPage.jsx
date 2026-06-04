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
                setLoading(true);

                const res = await api.get("/api/jobs");

                const safeJobs = Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

                setJobs(safeJobs);

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

    const recentJobs = [...jobs]
        .filter(Boolean)
        .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
        .slice(0, 3);

    return (
        <div>
            <h2>Your Recent Training Runs</h2>

            {recentJobs.length === 0 ? (
                <p>No training runs found</p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                    }}
                >
                    {recentJobs.map((job) => (
                        <div style={{ flex: "1 1 300px" }} key={job.jobId}>
                            <Card job={job} />
                        </div>
                    ))}
                </div>
            )}

            <h2 style={{ marginTop: "30px" }}>All Training Runs</h2>
            <DataTable jobs={jobs} />
        </div>
    );
}