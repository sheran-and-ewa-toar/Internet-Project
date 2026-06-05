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
    const { setTheme: setAppTheme, setUser } = useOutletContext();

    const [settings, setSettings] = useState({
        email: "",
        password: "",
        theme: "light"
    });

    const [originalSettings, setOriginalSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setError("");

                const res = await api.get("/api/settings");
                const backend = res.data?.data || res.data;

                const next = {
                    email: backend.email || "",
                    password: "",
                    theme: backend.theme || "light"
                };

                setSettings(next);
                setOriginalSettings(next);

                setAppTheme?.(next.theme);
                localStorage.setItem("theme", next.theme);

            } catch (err) {
                setError("Unable to load settings.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [setAppTheme]);

    const validateSettings = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!settings.email.trim()) return "Email is required.";
        if (!emailRegex.test(settings.email)) return "Invalid email.";

        if (settings.password && settings.password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        if (!settings.theme) return "Theme is required.";

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
            settings.email === originalSettings.email &&
            settings.theme === originalSettings.theme &&
            !settings.password;

        if (noChange) {
            setSuccess("No changes were made.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                email: settings.email,
                theme: settings.theme
            };

            if (settings.password.trim()) {
                payload.password = settings.password;
            }

            const res = await api.put("/api/settings", payload);

            const updated = res.data?.data || res.data;

            const synced = {
                email: updated.email || settings.email,
                theme: updated.theme || settings.theme,
                password: ""
            };

            setSettings(synced);
            setOriginalSettings(synced);

            setUser?.((prev) => ({
                ...prev,
                email: synced.email
            }));

            setAppTheme?.(synced.theme);
            localStorage.setItem("theme", synced.theme);

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

    if (loading) {
        return <div className="settings-page">Loading...</div>;
    }

    return (
        <div className="settings-page">
            <div className="settings-card">

                <h2>⚙️ Settings</h2>
                <p className="settings-subtitle">
                    Manage your profile and preferences
                </p>

                <form onSubmit={handleSubmit} className="settings-form">

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) =>
                                setSettings({ ...settings, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password (optional)</label>
                        <input
                            type="password"
                            value={settings.password}
                            onChange={(e) =>
                                setSettings({ ...settings, password: e.target.value })
                            }
                            placeholder="Leave empty to keep current password"
                        />
                    </div>

                    <div className="form-group">
                        <label>Theme</label>
                        <select
                            value={settings.theme}
                            onChange={(e) =>
                                setSettings({ ...settings, theme: e.target.value })
                            }
                        >
                            {themeOptions.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
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