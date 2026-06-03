import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import Settings from "./pages/SettingsPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {

    const isLoggedIn = localStorage.getItem("userId");

    return (
        <BrowserRouter>

            {isLoggedIn && <Navbar />}

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>

            {isLoggedIn && <Footer />}

        </BrowserRouter>
    );
}