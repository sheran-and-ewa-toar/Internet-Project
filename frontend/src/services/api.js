import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

api.interceptors.request.use((config) => {

    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (userId) {
        config.headers['x-user-id'] = userId;
    }

    if (userRole) {
        config.headers['x-user-role'] = userRole;
    }

    return config;
});

export default api;