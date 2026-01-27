import axios from 'axios';

// Configuration
const API_URL = "http://localhost:8080/api/v1/pos";

// Axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor to add token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const posService = {
    // Shift management
    openShift: (data) => api.post('/shift/open', data),
    closeShift: (data) => api.post('/shift/close', data),
    
    // Using the configured api instance ensures auth headers are sent
    getShiftTotals: (shiftId) => api.get(`/shifts/${shiftId}/totals`),

    //Search entire inventory (returns a list)
    searchInventory: (query) => api.get(`/products/search?q=${query}`),

    // Products
    getProduct: (id) => api.get(`/products/${id}`),
    getQuickItems: () => api.get('/products/quick'),
    

    // Customers
    findCustomer: (phone) => api.get(`/customers?phone=${phone}`),
    createCustomer: (data) => api.post('/customers', data),

    // Transactions and orders
    submitOrder: (orderData) => api.post('/orders', orderData),
    recordCashFlow: (data) => api.post('/cash-flow', data),

    // Bill management
    getBills: (status) => api.get(`/orders?status=${status}`),
    getBillById: (id) => api.get(`/orders/${id}`),
};