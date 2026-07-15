import { useEffect, useState } from "react";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import "../styles/UsersManagement.css";

export default function UsersManagement() {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({
            message,
            type
        });
    };
    
    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/users");

            setUsers(
                res.data?.data || res.data || []
            );

        } catch (err) {
            setError("Failed to load users.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {

            await api.delete(
                `/api/users/${selectedUser.userId}`
            );

            setUsers(prev =>
                prev.filter(
                    u =>
                    u.userId !== selectedUser.userId
                )
            );

            showToast(
                "User deleted successfully.",
                "success"
            );
        } catch(err) {
            showToast(
                "Failed to delete user.",
                "error"
            );
        } finally {
            setSelectedUser(null);
        }
    };

    return (
        <div className="users-page">
            <div className="users-card">

                <h2>
                    👥 User Management
                </h2>

                <p>
                    Manage registered users.
                    Deleting a user also removes
                    their training jobs.
                </p>

                {error &&
                    <div className="error-box">
                        {error}
                    </div>
                }

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                    {users.map(user => (
                        <tr key={user.userId}>
                            <td>
                                {user.userId}
                            </td>
                            <td>
                                {user.firstName} {user.lastName}
                            </td>
                            <td>
                                {user.email}
                            </td>
                            <td>
                                {user.userRole}
                            </td>
                            <td>
                                <button
                                    className="delete-user-btn"
                                    onClick={() =>
                                        setSelectedUser(user)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>

            <ConfirmModal
                isOpen={!!selectedUser}
                title="Delete User"
                message={
                    selectedUser
                    ?
                    `Delete ${selectedUser.email} and all related jobs?`
                    :
                    ""
                }
                onConfirm={handleDelete}
                onCancel={() =>
                    setSelectedUser(null)
                }
            />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}