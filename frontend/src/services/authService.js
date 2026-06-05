import api from './api';

export const login = async (email, password) => {

    const response = await api.post('/api/auth/login', {
        email,
        password
    });

    return response.data;
};

export const logout = async () => {
    try {
        await api.post('/api/auth/logout');
    } catch (err) {
        console.error("Logout cleanup failed on backend:", err);
    } finally {
        localStorage.clear();
    }
};