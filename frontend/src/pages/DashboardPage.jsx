import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import api from "../services/api";
import Card from "../components/Card";
import DataTable from "../components/DataTable";

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [featureSets, setFeatureSets] = useState([]);
    const [modelTypes, setModelTypes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [jobsRes, fsRes, mtRes] = await Promise.all([
                    api.get("/api/jobs"),
                    api.get("/api/feature-sets"),
                    api.get("/api/model-types")
                ]);

                const safeJobs =
                    jobsRes.data?.data ?? jobsRes.data ?? [];

                const safeFeatureSets =
                    fsRes.data?.data ?? fsRes.data ?? [];

                const safeModelTypes =
                    mtRes.data?.data ?? mtRes.data ?? [];

                setJobs(Array.isArray(safeJobs) ? safeJobs : []);
                setFeatureSets(Array.isArray(safeFeatureSets) ? safeFeatureSets : []);
                setModelTypes(Array.isArray(safeModelTypes) ? safeModelTypes : []);

            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    // ✅ enrich jobs
    const enrichedJobs = (jobs || []).map(job => ({
        ...job,

        featureSetName:
            featureSets.find(f =>
                Number(f.featureSetId) === Number(job.featureSetId)
            )?.name || `Feature Set ${job.featureSetId}`,

        modelName:
            modelTypes.find(m =>
                Number(m.modelTypeId) === Number(job.modelTypeId)
            )?.name || `Model ${job.modelTypeId}`
    }));

    const recentJobs = [...enrichedJobs]
        .filter(Boolean)
        .sort((a, b) =>
            new Date(b.createDate || 0) - new Date(a.createDate || 0)
        )
        .slice(0, 3);

    return (
        <div className="dashboard-page">

            <div className="dashboard-header">
                <h1>🧬 miRNA Classification Dashboard</h1>
                <p>
                    Monitor machine learning experiments,
                    compare feature engineering strategies,
                    and evaluate model performance.
                </p>
            </div>

            <section className="dashboard-section">
                <h2>Recent Training Runs</h2>

                {recentJobs.length === 0 ? (
                    <div className="empty-state">
                        No training runs found.
                    </div>
                ) : (
                    <div className="cards-grid">
                        {recentJobs.map(job => (
                            <Card key={job.jobId} job={job} />
                        ))}
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <h2>Training History</h2>
                <DataTable jobs={enrichedJobs} />
            </section>

        </div>
    );
}