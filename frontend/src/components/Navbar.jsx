import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

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
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                borderBottom: "1px solid #ddd"
            }}
        >

            {/* LEFT: Logo / Project Name */}
            <div style={{ fontWeight: "bold" }}>
                ML Training Platform
            </div>

            {/* CENTER: Navigation */}
            <div style={{ display: "flex", gap: "15px" }}>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/settings">Settings</Link>
            </div>

            {/* RIGHT: User + Logout */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                {user && (
                    <span>
                        👤 {user.firstName}
                    </span>
                )}

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}