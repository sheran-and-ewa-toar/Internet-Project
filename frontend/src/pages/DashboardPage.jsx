import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import api from "../services/api";
import socket from "../services/socket";
import Card from "../components/Card";
import DataTable from "../components/DataTable";

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [featureSets, setFeatureSets] = useState([]);
    const [modelTypes, setModelTypes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const syncUserPreferences = async () => {
            try {
                const res = await api.get("/api/users/me");
                const backendData = res.data?.data || res.data;
                
                if (backendData?.theme) {
                    
                    document.documentElement.dataset.theme = backendData.theme;
                    document.documentElement.style.colorScheme = 
                        backendData.theme === "dark" ? "dark" : "light";
                    localStorage.setItem("appTheme", backendData.theme);
                }
            } catch (err) {
                console.error("Could not sync user styling parameters on dashboard load", err);
            }
        };

        syncUserPreferences();
    }, []);


    const fetchMeta = async () => {
        const [fsRes, mtRes] = await Promise.all([
            api.get("/api/feature-sets"),
            api.get("/api/model-types")
        ]);

        setFeatureSets(fsRes.data?.data ?? fsRes.data ?? []);
        setModelTypes(mtRes.data?.data ?? mtRes.data ?? []);
    };

    const fetchJobs = async () => {
        const jobsRes = await api.get("/api/jobs");
        const safeJobs = jobsRes.data?.data ?? jobsRes.data ?? [];
        setJobs(Array.isArray(safeJobs) ? safeJobs : []);
    };

    useEffect(() => {
        const loadAll = async () => {
            try {
                setLoading(true);
                setError("");

                await Promise.all([
                    fetchMeta(),
                    fetchJobs()
                ]);

            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        loadAll();
    }, []);

    useEffect(() => {

        const refreshJobs = async () => {
            try {
                await fetchJobs();
            } catch (err) {
                console.error(err);
            }
        };

        socket.on("job_created", refreshJobs);
        socket.on("job_status_changed", refreshJobs);
        socket.on("job_completed", refreshJobs);
        socket.on("job_failed", refreshJobs);

        socket.on("job_deleted", (payload) => {
            setJobs(prev => prev.filter(j => j.jobId !== payload.jobId));
        });

        return () => {
            socket.off("job_created", refreshJobs);
            socket.off("job_status_changed", refreshJobs);
            socket.off("job_completed", refreshJobs);
            socket.off("job_failed", refreshJobs);
            socket.off("job_deleted");
        };

    }, []);    

    if (loading) return (
        <div className="skeleton-container">
            { }
            <div className="dashboard-header">
                <div className="skeleton-pulse skeleton-title"></div>
                <div className="skeleton-pulse skeleton-subtitle"></div>
            </div>

            { }
            <section className="dashboard-section">
                <div className="skeleton-pulse skeleton-section-heading" style={{ marginBottom: '15px' }}></div>
                <div className="skeleton-grid">
                    <div className="skeleton-pulse skeleton-card"></div>
                    <div className="skeleton-pulse skeleton-card"></div>
                    <div className="skeleton-pulse skeleton-card"></div>
                </div>
            </section>

            { }
            <section className="dashboard-section">
                <div className="skeleton-pulse skeleton-section-heading" style={{ marginBottom: '15px' }}></div>
                <div className="skeleton-pulse skeleton-table"></div>
            </section>
        </div>
    );
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    
    const enrichedJobs = (jobs || []).map(job => ({
        ...job,

        featureSetName:
            featureSets.find(f =>
                Number(f.featureSetId) === Number(job.featureSetId)
            )?.name || `Feature Set ${job.featureSetId}`,

        modelName:
            modelTypes.find(m =>
                Number(m.modelTypeId) === Number(job.modelTypeId)
            )?.name || `Model ${job.modelTypeId}`,

        // derive flags from backend data
        pearsonEnabled: job.pearsonThreshold != null,
        varianceEnabled: job.varianceThreshold != null
    }));

    const recentJobs = [...enrichedJobs]
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
                <div className="jobs-count">
                    Total jobs: {enrichedJobs.length}
                </div>
            </section>

        </div>
    );
}