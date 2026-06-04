import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) return "Email is required";
        if (!emailRegex.test(email)) return "Please enter a valid email";
        if (!password.trim()) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";

        return null;
    };

    const handleLogin = async () => {
        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await api.post("/api/auth/login", {
                email,
                password
            });

            localStorage.setItem("userId", res.data.data.userId);
            localStorage.setItem("userRole", res.data.data.userRole);
            localStorage.setItem(
                "userName",
                `${res.data.data.firstName} ${res.data.data.lastName}`
            );

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>🧬 miRNA Predictor</h1>
                    <p>Machine Learning Platform for miRNA Analysis</p>
                </div>

                <div className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && <div className="login-error">{error}</div>}
                </div>

                <div className="login-footer">
                    Predicting microRNA using structural and machine learning features
                </div>
            </div>
        </div>
    );
}