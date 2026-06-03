import api from './api';

export const login = async (email, password) => {

    const response = await api.post('/api/auth/login', {
        email,
        password
    });

    return response.data;
};

export const logout = async () => {

    await api.post('/api/auth/logout');

    localStorage.clear();
};