import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import Settings from "./pages/SettingsPage";
import CreateJob from "./pages/CreateJob";
import Register from "./pages/Register";
import About from "./pages/About";
import Layout from "./components/Layout";
import api from "./services/api";

const themeOptions = ["light", "dark", "pink", "teal"];

export default function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("appTheme");
        return themeOptions.includes(saved) ? saved : "light";
    });

    const [authenticated, setAuthenticated] = useState(() => !!localStorage.getItem("userId"));
    const [user, setUser] = useState(null);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
        localStorage.setItem("appTheme", theme);
    }, [theme]);

    useEffect(() => {
        if (!authenticated) {
            setUser(null);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await api.get("/api/users/me");
                setUser(res.data.data);
            } catch (err) {
                console.error("Failed to load user", err);
                setUser(null);
            }
        };

        fetchUser();
    }, [authenticated]);

    return (
        <BrowserRouter>
            <Routes>

                {/* public route */}
                <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
                <Route path="/register" element={<Register />}/>
                
                {/* protected routes */}
                <Route
                    path="/"
                    element={
                        authenticated ? (
                            <Layout theme={theme} setTheme={setTheme} user={user} setUser={setUser} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="create-job" element={<CreateJob />} />
                    <Route path="about" element={<About />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
