import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {

    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}