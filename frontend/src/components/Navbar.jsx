import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
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

                const user = res.data?.data || res.data;

                setLocalUser({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    userRole: user.userRole || "user",
                    theme: user.theme || "light",
                    userId: user.userId
                });
            } catch (err) {
                console.error("Failed to load user", err);
                setLocalUser(null);
            }
        };

        if (!propUser && !localUser) fetchUser();
    }, [propUser]);

    const user = propUser ?? localUser;
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
                🧬 miRNA ML Research
            </div>

            <div className="navbar-center">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/create-job"> New Job </NavLink>
                <NavLink to="/download">Download</NavLink>
                <NavLink to="/settings">Settings</NavLink>
                {user?.userRole === "admin" && (
                    <NavLink to="/users">Users</NavLink>
                )}
            </div>

            <div className="navbar-right">
                {user && (
                    <span>
                        👤 {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                    </span>
                )}

                <button onClick={logout}>Logout</button>
            </div>
        </nav>
    );
}