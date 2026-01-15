import axios from 'axios';

// CONFIGURATION
const API_URL = "http://localhost:8080/api/v1/pos"; // Back end API base URL

// AXIOS INSTANCE

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const posService = {
    // 1. Shift Management
    openShift: (data) => api.post('/shift/open', data),
    closeShift: (data) => api.post('/shift/close', data),

    // 2. Products
    getProduct: (id) => api.get(`/products/${id}`),
    getQuickItems: () => api.get('/products/quick'),

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