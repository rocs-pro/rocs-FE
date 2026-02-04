import axios from 'axios';

/**
 * Inventory API Client
 * Base URL: http://localhost:8080/api/inventory
 * Authorization: Bearer token from localStorage
 * Response format: { success: boolean, data: any, message: string }
 * Access data via: response.data.data
 */

// Base URL matches backend inventory module
const BASE_URL = 'http://localhost:8080/api/inventory';

// Create axios instance
const inventoryApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add Authorization header
inventoryApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('[InventoryAPI] Token:', token ? 'EXISTS' : 'MISSING');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('[InventoryAPI] Request:', config.method.toUpperCase(), config.baseURL + config.url);
        return config;
    },
    (error) => {
        console.error('[InventoryAPI] Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common responses and errors
inventoryApi.interceptors.response.use(
    (response) => {
        console.log('[InventoryAPI] Response:', response.config.method.toUpperCase(), response.config.url,
            'Status:', response.status, 'Data:', response.data);
        return response;
    },
    (error) => {
        console.error('[InventoryAPI] Error:', error.config?.method.toUpperCase(), error.config?.url,
            'Status:', error.response?.status, 'Message:', error.message,
            'Response:', error.response?.data);

        if (error.response?.status === 401) {
            console.error('[InventoryAPI] 401 Unauthorized - Token invalid or expired');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

/**
 * ========== CATEGORIES ==========
 */
export const getCategories = async () => {
    console.log('[InventoryAPI] GET categories');
    const response = await inventoryApi.get('/categories');
    console.log('[InventoryAPI] GET categories response:', response.data);
    return response.data.data || response.data;
};

export const createCategory = async (categoryData) => {
    console.log('[InventoryAPI] POST category:', categoryData);
    const response = await inventoryApi.post('/categories', categoryData);
    console.log('[InventoryAPI] POST category response:', response.data);
    return response.data.data || response.data;
};

export const updateCategory = async (id, categoryData) => {
    console.log('[InventoryAPI] PUT category:', id, categoryData);
    const response = await inventoryApi.put(`/categories/${id}`, categoryData);
    console.log('[InventoryAPI] PUT category response:', response.data);
    return response.data.data || response.data;
};

export const deleteCategory = async (id) => {
    console.log('[InventoryAPI] DELETE category:', id);
    const response = await inventoryApi.delete(`/categories/${id}`);
    console.log('[InventoryAPI] DELETE category response:', response.data);
    return response.data;
};

/**
 * ========== PRODUCTS ==========
 */
export const getProducts = async () => {
    console.log('[InventoryAPI] GET products');
    const response = await inventoryApi.get('/products');
    console.log('[InventoryAPI] GET products response:', response.data);
    return response.data.data || response.data;
};

export const createProduct = async (productData) => {
    console.log('[InventoryAPI] POST product:', productData);
    const response = await inventoryApi.post('/products', productData);
    console.log('[InventoryAPI] POST product response:', response.data);
    return response.data.data || response.data;
};

export const updateProduct = async (id, productData) => {
    console.log('[InventoryAPI] PUT product:', id, productData);
    const response = await inventoryApi.put(`/products/${id}`, productData);
    console.log('[InventoryAPI] PUT product response:', response.data);
    return response.data.data || response.data;
};

export const deleteProduct = async (id) => {
    console.log('[InventoryAPI] DELETE product:', id);
    const response = await inventoryApi.delete(`/products/${id}`);
    console.log('[InventoryAPI] DELETE product response:', response.data);
    return response.data;
};

/**
 * ========== BRANDS ==========
 */
export const getBrands = async () => {
    console.log('[InventoryAPI] GET brands');
    const response = await inventoryApi.get('/brands');
    console.log('[InventoryAPI] GET brands response:', response.data);
    return response.data.data || response.data;
};

export const createBrand = async (brandData) => {
    console.log('[InventoryAPI] POST brand:', brandData);
    const response = await inventoryApi.post('/brands', brandData);
    console.log('[InventoryAPI] POST brand response:', response.data);
    return response.data.data || response.data;
};

export const updateBrand = async (id, brandData) => {
    console.log('[InventoryAPI] PUT brand:', id, brandData);
    const response = await inventoryApi.put(`/brands/${id}`, brandData);
    console.log('[InventoryAPI] PUT brand response:', response.data);
    return response.data.data || response.data;
};

export const deleteBrand = async (id) => {
    console.log('[InventoryAPI] DELETE brand:', id);
    const response = await inventoryApi.delete(`/brands/${id}`);
    console.log('[InventoryAPI] DELETE brand response:', response.data);
    return response.data;
};

/**
 * ========== SUPPLIERS ==========
 */
export const getSuppliers = async () => {
    console.log('[InventoryAPI] GET suppliers');
    const response = await inventoryApi.get('/suppliers');
    console.log('[InventoryAPI] GET suppliers response:', response.data);
    return response.data.data || response.data;
};

export const createSupplier = async (supplierData) => {
    console.log('[InventoryAPI] POST supplier:', supplierData);
    const response = await inventoryApi.post('/suppliers', supplierData);
    console.log('[InventoryAPI] POST supplier response:', response.data);
    return response.data.data || response.data;
};

export const updateSupplier = async (id, supplierData) => {
    console.log('[InventoryAPI] PUT supplier:', id, supplierData);
    const response = await inventoryApi.put(`/suppliers/${id}`, supplierData);
    console.log('[InventoryAPI] PUT supplier response:', response.data);
    return response.data.data || response.data;
};

export const deleteSupplier = async (id) => {
    console.log('[InventoryAPI] DELETE supplier:', id);
    const response = await inventoryApi.delete(`/suppliers/${id}`);
    console.log('[InventoryAPI] DELETE supplier response:', response.data);
    return response.data;
};

/**
 * ========== STOCK ==========
 */
export const getStock = async () => {
    console.log('[InventoryAPI] GET stock');
    const response = await inventoryApi.get('/stock');
    console.log('[InventoryAPI] GET stock response:', response.data);
    return response.data.data || response.data;
};

export const getBatches = async () => {
    console.log('[InventoryAPI] GET batches');
    const response = await inventoryApi.get('/batches');
    console.log('[InventoryAPI] GET batches response:', response.data);
    return response.data.data || response.data;
};

export const getTransfers = async () => {
    console.log('[InventoryAPI] GET transfers');
    const response = await inventoryApi.get('/transfers');
    console.log('[InventoryAPI] GET transfers response:', response.data);
    return response.data.data || response.data;
};

export const createAdjustment = async (adjustmentData) => {
    console.log('[InventoryAPI] POST stock adjustment:', adjustmentData);
    const response = await inventoryApi.post('/stock/adjustments', adjustmentData);
    console.log('[InventoryAPI] POST stock adjustment response:', response.data);
    return response.data.data || response.data;
};

export default inventoryApi;
