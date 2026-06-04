import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Settings.css";

export default function Settings() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setError("");
                
                const res = await api.get("/api/settings");
                
                const backendData = res.data?.data || res.data;
                
                setSettings({
                    username: backendData.username || "",
                    email: backendData.email || "",
                    theme: backendData.theme || ""
                });
            } catch (err) {
                setError("Unable to load initial settings profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const validateSettings = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!settings.username?.trim()) return "Username is required.";
        if (!settings.email?.trim()) return "Email is required.";
        if (!emailRegex.test(settings.email)) return "Invalid email.";
        if (!settings.theme?.trim()) return "Theme is required.";

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateSettings();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            await api.put("/api/settings", settings);

            setSuccess("Settings updated successfully.");
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Unable to save settings."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="settings-loading">Loading...</div>;

    return (
        <div className="settings-page">

            <div className="settings-card">

                <h2>⚙️ Settings</h2>
                <p className="settings-subtitle">
                    Manage your profile and experiment preferences
                </p>

                <form onSubmit={handleSubmit} className="settings-form">

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={settings.username || ""}
                            onChange={(e) =>
                                setSettings({ ...settings, username: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={settings.email || ""}
                            onChange={(e) =>
                                setSettings({ ...settings, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Theme</label>
                        <input
                            type="text"
                            value={settings.theme || ""}
                            onChange={(e) =>
                                setSettings({ ...settings, theme: e.target.value })
                            }
                        />
                    </div>

                    <button disabled={loading}>
                        {loading ? "Saving..." : "Save Settings"}
                    </button>

                    {error && <div className="error-box">{error}</div>}
                    {success && <div className="success-box">{success}</div>}
                </form>

            </div>

        </div>
    );
}