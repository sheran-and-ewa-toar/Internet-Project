import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import Settings from "./pages/SettingsPage";

import Layout from "./components/Layout";

const themeOptions = ["light", "dark", "pink", "teal"];

function isLoggedIn() {
    return !!localStorage.getItem("userId");
}

export default function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("appTheme");
        return themeOptions.includes(saved) ? saved : "light";
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
        localStorage.setItem("appTheme", theme);
    }, [theme]);

    return (
        <BrowserRouter>
            <Routes>

                {/* public route */}
                <Route path="/login" element={<Login />} />

                {/* protected routes */}
                <Route
                    path="/"
                    element={
                        isLoggedIn() ? (
                            <Layout theme={theme} setTheme={setTheme} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
