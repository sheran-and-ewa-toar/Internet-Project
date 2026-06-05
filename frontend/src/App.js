import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import Settings from "./pages/SettingsPage";
import CreateJob from "./pages/CreateJob";
import Layout from "./components/Layout";

const themeOptions = ["light", "dark", "pink", "teal"];

export default function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("appTheme");
        return themeOptions.includes(saved) ? saved : "light";
    });

    const [authenticated, setAuthenticated] = useState(() => !!localStorage.getItem("userId"));

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
        localStorage.setItem("appTheme", theme);
    }, [theme]);

    return (
        <BrowserRouter>
            <Routes>

                {/* public route */}
                <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />

                {/* protected routes */}
                <Route
                    path="/"
                    element={
                        authenticated ? (
                            <Layout theme={theme} setTheme={setTheme} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="create-job" element={<CreateJob />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
