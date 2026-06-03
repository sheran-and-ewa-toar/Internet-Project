import { useEffect, useState } from "react";

import api from "../services/api";

import Card from "../components/Card";
import DataTable from "../components/DataTable";

export default function Dashboard() {

    const [jobs, setJobs] = useState([]);
    const [featureSets, setFeatureSets] = useState([]);
    const [filters, setFilters] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadData = async () => {

            try {

                const jobsRes =
                    await api.get("/api/jobs");

                const featureSetsRes =
                    await api.get("/api/feature-sets");

                const filtersRes =
                    await api.get("/api/feature-filters");

                setJobs(jobsRes.data.data);
                setFeatureSets(featureSetsRes.data.data);
                setFilters(filtersRes.data.data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();

    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div style={{ padding: "20px" }}>

            <h1>Model Training Dashboard</h1>

            <div style={{ display: "flex" }}>

                <Card
                    title="Training Jobs"
                    value={jobs.length}
                />

                <Card
                    title="Feature Sets"
                    value={featureSets.length}
                />

                <Card
                    title="Filters"
                    value={filters.length}
                />

            </div>

            <h2>Recent Jobs</h2>

            <DataTable jobs={jobs} />

        </div>
    );
}