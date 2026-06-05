import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Navbar.css";

export default function Navbar({ user: propUser, setUser: propSetUser }) {
    const [localUser, setLocalUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (propUser) return;

        const fetchUser = async () => {
            try {
                const res = await api.get("/api/users/me");
                setLocalUser(res.data.data);
            } catch (err) {
                console.error("Failed to load user", err);
                setLocalUser(null);
            }
        };

        fetchUser();
    }, [propUser]);

    const user = propUser || localUser;
    const setUser = propSetUser || setLocalUser;

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
                {user && (
                    <span>
                        👤 {user.username?.trim() || [user.firstName, user.lastName].filter(Boolean).join(" ")}
                    </span>
                )}

                <button onClick={logout}>Logout</button>
            </div>
        </nav>
    );
}