import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import Settings from "./pages/SettingsPage";
import Layout from "./components/Layout";

export default function App() {

    const isLoggedIn = localStorage.getItem("userId");

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn ? (
                            <Layout>
                                <Dashboard />
                            </Layout>
                        ) : (
                            <Login />
                        )
                    }
                />
                <Route
                    path="/settings"
                    element={
                        isLoggedIn ? (
                            <Layout>
                                <Settings />
                            </Layout>
                        ) : (
                            <Login />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}