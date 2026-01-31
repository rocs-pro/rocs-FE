import axios from 'axios';

// Configuration
const API_URL = "http://localhost:8080/api/v1/pos";

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
    return config;
}, (error) => Promise.reject(error));

export const posService = {
    // Shift management
    openShift: (data) => api.post('/shift/open', data),
    closeShift: (data) => api.post('/shift/close', data),
    getShiftTotals: (shiftId) => api.get(`/shift/${shiftId}/totals`),
    getCashiers: () => api.get('/cashiers'),

    // --- PRODUCTS ---
    // Scan (Exact Match - Returns Single Object)
    getProduct: (code) => api.get(`/products/scan?code=${code}`),
    
    // Search (Fuzzy - Returns List)
    searchInventory: (query) => api.get(`/products/search?q=${query}`),
    
    // Quick Grid
    getQuickItems: () => api.get('/products/quick'),

    // Transactions
    submitOrder: (orderData) => api.post('/orders', orderData),
    getBills: (status) => api.get(`/orders?status=${status || ''}`),
    getBillById: (id) => api.get(`/orders/${id}`),

    // Customers
    findCustomer: (phone) => api.get(`/customers?phone=${phone}`),
    createCustomer: (data) => api.post('/customers', data),
    
    // Cash Flow
    recordCashFlow: (data) => api.post('/cash-flow', data)
};