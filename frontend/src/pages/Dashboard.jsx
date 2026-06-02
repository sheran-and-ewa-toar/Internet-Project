import { useEffect, useState } from "react";
import { api } from "../services/api";
import Card from "../components/Card";
import DataTable from "../components/DataTable";

export default function Dashboard() {

    const [runs, setRuns] = useState([]);

    useEffect(() => {
        api("/api/training-runs")
            .then(res => setRuns(res.data));
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>

            {/* Cards reused 3 times */}
            {runs.slice(0, 3).map((r, i) => (
                <Card
                    key={i}
                    title={r.modelName}
                    description={`Accuracy: ${r.accuracy}`}
                />
            ))}

            <h3>Training Runs Table</h3>

            <DataTable data={runs} />
        </div>
    );
}