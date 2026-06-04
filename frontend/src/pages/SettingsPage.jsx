import { useEffect, useState } from "react";
import api from "../services/api";

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

        if (!settings.username?.trim()) {
            return "Username is required.";
        }

        if (!settings.email?.trim()) {
            return "Email is required.";
        }

        if (!emailRegex.test(settings.email)) {
            return "Please enter a valid email address.";
        }

        if (!settings.theme?.trim()) {
            return "Theme selection cannot be empty.";
        }

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
                    "Unable to save settings. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Settings</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="settings-username">Username</label>
                    <input
                        id="settings-username"
                        type="text"
                        value={settings.username || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                username: e.target.value,
                            })
                        }
                        placeholder="Enter username"
                    />
                </div>

                <div>
                    <label htmlFor="settings-email">Email</label>
                    <input
                        id="settings-email"
                        type="email"
                        value={settings.email || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                email: e.target.value,
                            })
                        }
                        placeholder="Enter email"
                    />
                </div>

                <div>
                    <label htmlFor="settings-theme">Theme</label>
                    <input
                        id="settings-theme"
                        type="text"
                        value={settings.theme || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                theme: e.target.value,
                            })
                        }
                        placeholder="Preferred theme"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Settings"}
                </button>
            </form>

            {error && (
                <p style={{ color: "#b00020", marginTop: "14px" }}>
                    {error}
                </p>
            )}

            {success && (
                <p style={{ color: "#2a7f3d", marginTop: "14px" }}>
                    {success}
                </p>
            )}
        </div>
    );
}
