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
    console.log('[API] Token from localStorage:', token ? 'EXISTS' : 'MISSING');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('[API] Request:', config.method.toUpperCase(), config.baseURL + config.url);
    return config;
}, (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
});

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        console.log('[API] Response:', response.config.method.toUpperCase(), response.config.url, 'Status:', response.status);
        return response;
    },
    (error) => {
        // Enhanced error logging
        const method = error.config?.method.toUpperCase();
        const url = error.config?.url;
        const status = error.response?.status;
        const statusText = error.response?.statusText;
        const errorData = error.response?.data;
        
        console.group(`[API] ❌ ${method} ${url} - ${status} ${statusText}`);
        console.error('Status:', status);
        console.error('Status Text:', statusText);
        console.error('Error Data:', errorData);
        console.error('Error Message:', error.message);
        console.error('Full Response:', error.response);
        console.groupEnd();
        
        if (error.response?.status === 401) {
            // Token expired or invalid
            console.error('[API] 401 Unauthorized - Removing token and redirecting to login');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        if (error.response?.status === 500) {
            console.error('[API] 500 Internal Server Error - Backend endpoint may not exist or has a bug');
            console.error('[API] Endpoint:', url);
            console.error('[API] This endpoint needs to be implemented on the backend');
        }
        
        return Promise.reject(error);
    }
);

export default api;
