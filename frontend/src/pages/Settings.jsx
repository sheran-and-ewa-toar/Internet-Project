import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Settings() {

    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api("/api/settings")
            .then(res => setSettings(res.data))
            .finally(() => setLoading(false));
    }, []);

    const updateSetting = async () => {

        await api("/api/settings", {
            method: "PUT",
            body: JSON.stringify(settings)
        });

        alert("Settings updated");
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Settings</h2>

            <input
                value={settings.username || ""}
                onChange={(e) =>
                    setSettings({ ...settings, username: e.target.value })
                }
            />

            <input
                value={settings.email || ""}
                onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                }
            />

            <input
                value={settings.theme || ""}
                onChange={(e) =>
                    setSettings({ ...settings, theme: e.target.value })
                }
            />

            <button onClick={updateSetting}>
                Save
            </button>
        </div>
    );
}