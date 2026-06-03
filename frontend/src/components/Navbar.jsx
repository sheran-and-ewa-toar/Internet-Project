import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Navbar() {

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res = await api.get("/api/users/me");

                setUser(res.data.data);

            } catch {

                setUser(null);
            }
        };

        fetchUser();

    }, []);

    const logout = async () => {

        try {

            await api.post("/api/auth/logout");

        } catch {

        }

        localStorage.clear();

        navigate("/login");
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px"
            }}
        >
            <h3>miRNA Model Trainer</h3>

            <div>
                <Link to="/dashboard">Dashboard</Link>
                {" | "}
                <Link to="/settings">Settings</Link>
            </div>

            <div>

                {user && (
                    <span>
                        {user.firstName} {user.lastName}
                    </span>
                )}

                {" "}

                <button onClick={logout}>
                    Logout
                </button>

            </div>
        </nav>
    );
}