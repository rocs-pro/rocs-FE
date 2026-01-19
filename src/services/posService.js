import axios from 'axios';

// CONFIGURATION
const API_URL = "http://localhost:8080/api/v1/pos"; // Back end API base URL

// AXIOS INSTANCE

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// INTERCEPTOR: Add Token to every request
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
    // 1. Shift Management
    openShift: (data) => api.post('/shift/open', data),
    closeShift: (data) => api.post('/shift/close', data),

    // 2. Products
    getProduct: (id) => api.get(`/products/${id}`),
    
    // FIXME: Backend endpoint /products/quick returns "No static resource" (404/500).
    // Using mock data temporarily to unblock UI development.
    getQuickItems: () => Promise.resolve({
        data: [
            { id: 101, name: 'Milk 1L', price: 350.00 },
            { id: 102, name: 'Bread 450g', price: 190.00 },
            { id: 103, name: 'Eggs (10pk)', price: 550.00 },
            { id: 104, name: 'Yogurt Cup', price: 80.00 },
            { id: 105, name: 'Samba Rice 1kg', price: 260.00 },
            { id: 106, name: 'Sugar 1kg', price: 240.00 }
        ]
    }),
    // Original call:
    // getQuickItems: () => api.get('/products/quick'),

    // 3. Customers
    findCustomer: (phone) => api.get(`/customers?phone=${phone}`),
    createCustomer: (data) => api.post('/customers', data),

    // 4. Transactions
    submitOrder: (orderData) => api.post('/orders', orderData),
    recordCashFlow: (data) => api.post('/cash-flow', data),

    // 5. Bill Management (Recall/Return)
    getBills: (status) => api.get(`/orders?status=${status}`),
    getBillById: (id) => api.get(`/orders/${id}`),
};