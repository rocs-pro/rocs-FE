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

/**
 * ========== GRN (Goods Received Note) ==========
 */

/**
 * Get all GRNs for a branch
 * GET /api/inventory/grn/branch/{branchId}
 */
export const getGRNsByBranch = async (branchId) => {
    console.log('[InventoryAPI] GET GRNs by branch:', branchId);
    const response = await inventoryApi.get(`/grn/branch/${branchId}`);
    console.log('[InventoryAPI] GET GRNs by branch response:', response.data);
    return response.data.data || response.data;
};

/**
 * Get GRN by ID
 * GET /api/inventory/grn/{grnId}
 */
export const getGRNById = async (grnId) => {
    console.log('[InventoryAPI] GET GRN by ID:', grnId);
    const response = await inventoryApi.get(`/grn/${grnId}`);
    console.log('[InventoryAPI] GET GRN by ID response:', response.data);
    return response.data.data || response.data;
};

/**
 * Search GRNs with filters
 * POST /api/inventory/grn/search
 */
export const searchGRNs = async (filterData) => {
    console.log('[InventoryAPI] POST GRN search:', filterData);
    const response = await inventoryApi.post('/grn/search', filterData);
    console.log('[InventoryAPI] POST GRN search response:', response.data);
    return response.data.data || response.data;
};

/**
 * Create new GRN
 * POST /api/inventory/grn
 */
export const createGRN = async (grnData) => {
    console.log('[InventoryAPI] POST GRN:', grnData);
    // Get current user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.userId || user.id || 1;
    
    const config = {
        headers: {
            'User-ID': userId
        }
    };
    
    const response = await inventoryApi.post('/grn', grnData, config);
    console.log('[InventoryAPI] POST GRN response:', response.data);
    return response.data.data || response.data;
};

/**
 * Update GRN (only if pending)
 * PUT /api/inventory/grn/{grnId}
 */
export const updateGRN = async (grnId, grnData) => {
    console.log('[InventoryAPI] PUT GRN:', grnId, grnData);
    const response = await inventoryApi.put(`/grn/${grnId}`, grnData);
    console.log('[InventoryAPI] PUT GRN response:', response.data);
    return response.data.data || response.data;
};

/**
 * Approve GRN
 * PUT /api/inventory/grn/{grnId}/approve
 */
export const approveGRN = async (grnId) => {
    console.log('[InventoryAPI] PUT GRN approve:', grnId);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.userId || user.id || 1;
    
    const config = {
        headers: {
            'User-ID': userId
        }
    };
    
    const response = await inventoryApi.put(`/grn/${grnId}/approve`, {}, config);
    console.log('[InventoryAPI] PUT GRN approve response:', response.data);
    return response.data.data || response.data;
};

/**
 * Reject GRN
 * PUT /api/inventory/grn/{grnId}/reject
 */
export const rejectGRN = async (grnId, reason) => {
    console.log('[InventoryAPI] PUT GRN reject:', grnId, reason);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.userId || user.id || 1;
    
    const config = {
        headers: {
            'User-ID': userId
        },
        params: {
            reason: reason
        }
    };
    
    const response = await inventoryApi.put(`/grn/${grnId}/reject`, {}, config);
    console.log('[InventoryAPI] PUT GRN reject response:', response.data);
    return response.data.data || response.data;
};

/**
 * Update GRN payment status
 * PUT /api/inventory/grn/{grnId}/payment-status
 */
export const updateGRNPaymentStatus = async (grnId, paymentStatus) => {
    console.log('[InventoryAPI] PUT GRN payment status:', grnId, paymentStatus);
    const response = await inventoryApi.put(`/grn/${grnId}/payment-status`, null, {
        params: { paymentStatus }
    });
    console.log('[InventoryAPI] PUT GRN payment status response:', response.data);
    return response.data.data || response.data;
};

/**
 * Delete GRN (only if pending)
 * DELETE /api/inventory/grn/{grnId}
 */
export const deleteGRN = async (grnId) => {
    console.log('[InventoryAPI] DELETE GRN:', grnId);
    const response = await inventoryApi.delete(`/grn/${grnId}`);
    console.log('[InventoryAPI] DELETE GRN response:', response.data);
    return response.data;
};

/**
 * Get GRN statistics for a branch
 * GET /api/inventory/grn/branch/{branchId}/stats
 */
export const getGRNStats = async (branchId, period) => {
    console.log('[InventoryAPI] GET GRN stats:', branchId, period);
    const params = period ? { period } : {};
    const response = await inventoryApi.get(`/grn/branch/${branchId}/stats`, { params });
    console.log('[InventoryAPI] GET GRN stats response:', response.data);
    return response.data.data || response.data;
};

/**
 * Get pending GRNs for approval
 * GET /api/inventory/grn/pending
 */
export const getPendingGRNs = async (branchId) => {
    console.log('[InventoryAPI] GET pending GRNs:', branchId);
    const params = branchId ? { branchId } : {};
    const response = await inventoryApi.get('/grn/pending', { params });
    console.log('[InventoryAPI] GET pending GRNs response:', response.data);
    return response.data.data || response.data;
};

/**
 * Get GRN items by product
 * GET /api/inventory/grn/product/{productId}/items
 */
export const getGRNItemsByProduct = async (productId, branchId) => {
    console.log('[InventoryAPI] GET GRN items by product:', productId, branchId);
    const params = branchId ? { branchId } : {};
    const response = await inventoryApi.get(`/grn/product/${productId}/items`, { params });
    console.log('[InventoryAPI] GET GRN items by product response:', response.data);
    return response.data.data || response.data;
};

/**
 * Get GRNs by supplier
 * GET /api/inventory/grn/supplier/{supplierId}
 */
export const getGRNsBySupplier = async (supplierId) => {
    console.log('[InventoryAPI] GET GRNs by supplier:', supplierId);
    const response = await inventoryApi.get(`/grn/supplier/${supplierId}`);
    console.log('[InventoryAPI] GET GRNs by supplier response:', response.data);
    return response.data.data || response.data;
};

/**
 * Check if GRN number exists
 * GET /api/inventory/grn/check-number/{grnNo}
 */
export const checkGRNNumber = async (grnNo) => {
    console.log('[InventoryAPI] GET check GRN number:', grnNo);
    const response = await inventoryApi.get(`/grn/check-number/${grnNo}`);
    console.log('[InventoryAPI] GET check GRN number response:', response.data);
    return response.data.data || response.data;
};

export default inventoryApi;
