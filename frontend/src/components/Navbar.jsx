import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api("/api/users/me", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, []);

    const logout = async () => {
        await api("/api/auth/logout", {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token")
            }
        });

        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>ML Project</h3>

            <div>
                <a href="/dashboard">Dashboard</a>
                <a href="/settings">Settings</a>
            </div>

            <div>
                {user?.firstName && <span>{user.firstName}</span>}
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    );
}