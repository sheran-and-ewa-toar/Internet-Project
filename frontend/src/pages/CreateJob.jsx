import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";
import "../styles/CreateJob.css";

export default function CreateJob() {
    const [featureSets, setFeatureSets] = useState([]);
    const [modelTypes, setModelTypes] = useState([]);
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({
        featureSetId: "",
        modelTypeId: "",
        pearsonEnabled: false,
        pearsonThreshold: 0.9,
        varianceEnabled: false,
        varianceThreshold: 0.01
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [fs, mt] = await Promise.all([
                    api.get("/api/feature-sets"),
                    api.get("/api/model-types")
                ]);

                setFeatureSets(fs.data.data || []);
                setModelTypes(mt.data.data || []);
            } catch (err) {
                setError("Failed to load metadata");
            }
        };

        fetchMeta();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await api.post("/api/jobs", form);

            setToast({
                message: "Job successfully submitted 🚀",
                type: "success"
            });

            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);

        } catch (err) {
            setError("Failed to create job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-job-page">

            {/* 🔔 TOAST MUST BE HERE (overlay level) */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="create-job-card">

                <h2>🚀 Create Training Job</h2>

                <form onSubmit={handleSubmit}>

                    <label>Feature Set</label>
                    <select
                        name="featureSetId"
                        value={form.featureSetId}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        {featureSets.map(fs => (
                            <option key={fs.featureSetId} value={fs.featureSetId}>
                                {fs.name}
                            </option>
                        ))}
                    </select>

                    <label>Model Type</label>
                    <select
                        name="modelTypeId"
                        value={form.modelTypeId}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        {modelTypes.map(m => (
                            <option key={m.modelTypeId} value={m.modelTypeId}>
                                {m.name}
                            </option>
                        ))}
                    </select>

                    <label>
                        <input
                            type="checkbox"
                            name="pearsonEnabled"
                            checked={form.pearsonEnabled}
                            onChange={handleChange}
                        />
                        Pearson Filter
                    </label>

                    <label>Pearson Threshold</label>
                    <input
                        type="number"
                        step="0.01"
                        name="pearsonThreshold"
                        value={form.pearsonThreshold}
                        onChange={handleChange}
                    />

                    <label>
                        <input
                            type="checkbox"
                            name="varianceEnabled"
                            checked={form.varianceEnabled}
                            onChange={handleChange}
                        />
                        Variance Filter
                    </label>

                    <label>Variance Threshold</label>
                    <input
                        type="number"
                        step="0.001"
                        name="varianceThreshold"
                        value={form.varianceThreshold}
                        onChange={handleChange}
                    />

                    <button disabled={loading}>
                        {loading ? "Creating & Running..." : "Create Job"}
                    </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}