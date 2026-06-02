const BASE_URL = "http://localhost:3000";

export const api = async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
};