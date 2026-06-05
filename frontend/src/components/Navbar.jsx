import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Navbar.css";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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
    }, []);

    const logout = async () => {
        try {
            await api.post("/api/auth/logout");

            localStorage.removeItem("userId");
            localStorage.removeItem("userRole");

            setUser(null);

            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                🧬 miRNA Platform
            </div>

            <div className="navbar-center">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/settings">Settings</Link>
                <Link to="/create-job">New Job</Link>
            </div>

            <div className="navbar-right">
                {user && <span>👤 {user.firstName}</span>}

                <button onClick={logout}>Logout</button>
            </div>
        </nav>
    );
}