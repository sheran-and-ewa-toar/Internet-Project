import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api";
import "../styles/Settings.css";

const themeOptions = [
    { value: "light", label: "Default (Light)" },
    { value: "dark", label: "Dark" },
    { value: "pink", label: "Creator's Preference #1" },
    { value: "teal", label: "Creator's Preference #2" }
];

export default function Settings() {
    const { theme: savedTheme, setTheme: setAppTheme } = useOutletContext();

    const [settings, setSettings] = useState({});
    const [originalSettings, setOriginalSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setError("");
                
                const res = await api.get("/api/settings");
                
                const backendData = res.data?.data || res.data;
                const loadedTheme = backendData.theme || "light";

                const nextSettings = {
                    username: backendData.username || "",
                    email: backendData.email || "",
                    theme: loadedTheme
                };

                setSettings(nextSettings);
                setOriginalSettings(nextSettings);
                setAppTheme?.(loadedTheme);
            } catch (err) {
                setError("Unable to load initial settings profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [setAppTheme]);

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

        const noChange =
            settings.username === originalSettings.username &&
            settings.email === originalSettings.email &&
            settings.theme === originalSettings.theme;

        if (noChange) {
            setSuccess("No changes were made.");
            return;
        }

        try {
            setLoading(true);

            await api.put("/api/settings", settings);
            setOriginalSettings(settings);
            setSuccess("Settings updated successfully.");
            setAppTheme?.(settings.theme);
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
                        <label htmlFor="settings-theme">Theme</label>
                        <select
                            id="settings-theme"
                            value={settings.theme || savedTheme || "light"}
                            onChange={(e) => {
                                const nextTheme = e.target.value;
                                setSettings({ ...settings, theme: nextTheme });
                            }}
                        >
                            {themeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
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