import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import Settings from "./pages/SettingsPage";
import CreateJob from "./pages/CreateJob";
import Layout from "./components/Layout";

function isLoggedIn() {
    return !!localStorage.getItem("userId");
}

export default function App() {
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
                            <Layout />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="/create-job" element={<CreateJob />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}