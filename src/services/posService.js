import axios from 'axios';

const API_URL = "http://localhost:8080/api/v1/pos";

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

export const posService = {
    // --- NEW: Fetch Next Invoice ---
    getNextInvoiceNo: () => api.get('/next-invoice'),

    // Updated Submit Order (Handles complex object)
    submitOrder: (orderData) => {
        // orderData now matches the CreateSaleRequest DTO with 'payments' list
        return api.post('/orders', orderData);
    },

    // Shift
    openShift: (data) => api.post('/shift/open', data),
    closeShift: (data) => api.post('/shift/close', data),
    getShiftTotals: (shiftId) => api.get(`/shift/${shiftId}/totals`),
    getCashiers: () => api.get('/cashiers'),

    // Products
    getProduct: (code) => api.get(`/products/scan?code=${code}`),
    searchInventory: (query) => api.get(`/products/search?q=${query}`),
    getQuickItems: () => api.get('/products/quick'),

    // Orders
    submitOrder: (orderData) => api.post('/orders', orderData),
    getBills: (status) => api.get(`/orders?status=${status || ''}`),
    getBillById: (id) => api.get(`/orders/${id}`),

    // Misc
    findCustomer: (phone) => api.get(`/customers?phone=${phone}`),
    createCustomer: (data) => api.post('/customers', data),
    recordCashFlow: (data) => api.post('/cash-flow', data)
};