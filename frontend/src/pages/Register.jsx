import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

export default function Register({ setAuthenticated }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.firstName.trim()) return "First name is required";
        if (!form.lastName.trim()) return "Last name is required";

        if (!form.email.trim()) return "Email is required";
        if (!emailRegex.test(form.email)) return "Please enter a valid email";

        if (!form.password.trim()) return "Password is required";
        if (form.password.length < 6)
            return "Password must be at least 6 characters";

        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await api.post("/api/users", form);

            const userId = res.data?.data?.userId;

            if (!userId) {
                throw new Error("User ID not returned from server");
            }

            localStorage.setItem("userId", userId);
            localStorage.setItem("userRole", "user");
            localStorage.setItem(
                "userName",
                `${form.firstName} ${form.lastName}`
            );

            if (setAuthenticated) {
                setAuthenticated(true);
            }

            navigate("/dashboard");

        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                err.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <h1>🧬 Create Account</h1>
                    <p>Register a new user account</p>
                </div>

                <form className="login-form" onSubmit={handleRegister}>

                    <input
                        name="firstName"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={handleChange}
                    />

                    <input
                        name="lastName"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}
                </form>

            </div>
        </div>
    );
}