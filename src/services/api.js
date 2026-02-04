import axios from 'axios';

// Configuration
const API_URL = "http://localhost:8080/api/inventory";

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('[API] Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
}, (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
});

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        console.log('[API] Response:', response.config?.method?.toUpperCase(), response.config?.url, 'Status:', response.status);
        return response;
    },
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        console.error('[API] Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;
