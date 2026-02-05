import api from './api';
import {
    mapProductFromBackend,
    mapProductToBackend,
    mapProductsFromBackend,
    mapCategoryFromBackend,
    mapCategoryToBackend,
    mapCategoriesFromBackend,
    mapBrandFromBackend,
    mapBrandToBackend,
    mapBrandsFromBackend,
    mapSupplierFromBackend,
    mapSupplierToBackend,
    mapSuppliersFromBackend,
    mapGRNFromBackend,
    mapGRNToBackend,
    mapGRNsFromBackend,
    mapSubCategoriesFromBackend,
    mapSubCategoryToBackend,
    mapSubCategoryFromBackend,
    mapBranchesFromBackend
} from './inventoryMapper';

/**
 * Inventory Service
 * Handles all inventory-related API calls (Products, Categories, Brands, Suppliers)
 * Backend returns: { success: boolean, data: any, message: string }
 * For lists, use response.data.data
 */

export const inventoryService = {
    // ============= PRODUCTS =============

    /**
     * Get all products
     * @returns {Promise} Array of products in frontend format (snake_case)
     */
    getProducts: async () => {
        try {
            console.log('[InventoryService] GET products');
            const response = await api.get('/inventory/products');
            console.log('[InventoryService] GET products response:', response.data);
            // Backend returns { success, data: [...], message }
            const products = response.data.data || response.data;
            const mapped = mapProductsFromBackend(products);
            console.log('[InventoryService] GET products mapped:', mapped.length, 'items');
            return mapped;
        } catch (error) {
            console.error('[InventoryService] GET products error:', error?.response || error);
            throw error;
        }
    },

    /**
     * Get product by ID
     * @param {number} productId - Product ID
     * @returns {Promise} Product object in frontend format
     */
    getProductById: async (productId) => {
        try {
            const response = await api.get(`/inventory/products/${productId}`);
            const product = response.data.data || response.data;
            return mapProductFromBackend(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    /**
     * Search products by query
     * @param {string} query - Search query
     * @returns {Promise} Array of products
     */
    searchProducts: async (query) => {
        try {
            const response = await api.get(`/products/search?q=${query}`);
            const products = response.data.data || response.data;
            return mapProductsFromBackend(products);
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },

    /**
     * Create new product
     * @param {Object} productData - Product data in frontend format (snake_case)
     * @returns {Promise} Created product
     */
    createProduct: async (productData) => {
        try {
            const backendData = mapProductToBackend(productData);
            const response = await api.post('/inventory/products', backendData);
            const product = response.data.data || response.data;
            return mapProductFromBackend(product);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    /**
     * Update product
     * @param {number} productId - Product ID
     * @param {Object} productData - Product data in frontend format
     * @returns {Promise} Updated product
     */
    updateProduct: async (productId, productData) => {
        try {
            const backendData = mapProductToBackend(productData);
            const response = await api.put(`/inventory/products/${productId}`, backendData);
            const product = response.data.data || response.data;
            return mapProductFromBackend(product);
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    /**
     * Delete product
     * @param {number} productId - Product ID
     * @returns {Promise}
     */
    deleteProduct: async (productId) => {
        try {
            const response = await api.delete(`/inventory/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    /**
     * Get products by category
     * @param {number} categoryId - Category ID
     * @returns {Promise} Array of products
     */
    getProductsByCategory: async (categoryId) => {
        try {
            const response = await api.get(`/products/category/${categoryId}`);
            const products = response.data.data || response.data;
            return mapProductsFromBackend(products);
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    },

    /**
     * Get products by brand
     * @param {number} brandId - Brand ID
     * @returns {Promise} Array of products
     */
    getProductsByBrand: async (brandId) => {
        try {
            const response = await api.get(`/products/brand/${brandId}`);
            const products = response.data.data || response.data;
            return mapProductsFromBackend(products);
        } catch (error) {
            console.error('Error fetching products by brand:', error);
            throw error;
        }
    },

    // ============= CATEGORIES =============

    /**
     * Get all categories
     * @returns {Promise} Array of categories in frontend format
     */
    getCategories: async () => {
        try {
            console.log('[InventoryService] GET categories');
            const response = await api.get('/inventory/categories');
            console.log('[InventoryService] GET categories response:', response.data);
            const categories = response.data.data || response.data;
            const mapped = mapCategoriesFromBackend(categories);
            console.log('[InventoryService] GET categories mapped:', mapped.length, 'items');
            return mapped;
        } catch (error) {
            console.error('[InventoryService] GET categories error:', error?.response || error);
            throw error;
        }
    },

    /**
     * Get category by ID
     * @param {number} categoryId - Category ID
     * @returns {Promise} Category object
     */
    getCategoryById: async (categoryId) => {
        try {
            const response = await api.get(`/inventory/categories/${categoryId}`);
            const category = response.data.data || response.data;
            return mapCategoryFromBackend(category);
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    /**
     * Create new category
     * @param {Object} categoryData - Category data in frontend format
     * @returns {Promise} Created category
     */
    createCategory: async (categoryData) => {
        try {
            // eslint-disable-next-line no-unused-vars
            const { category_id, ...rest } = categoryData;
            console.log('[InventoryService] POST category:', rest);
            const backendData = mapCategoryToBackend(rest);
            console.log('[InventoryService] POST category (mapped):', backendData);
            const response = await api.post('/inventory/categories', backendData);
            console.log('[InventoryService] POST category response:', response.data);
            const category = response.data.data || response.data;
            return mapCategoryFromBackend(category);
        } catch (error) {
            console.error('[InventoryService] POST category error:', error?.response || error);
            throw error;
        }
    },

    /**
     * Update category
     * @param {number} categoryId - Category ID
     * @param {Object} categoryData - Category data in frontend format
     * @returns {Promise} Updated category
     */
    updateCategory: async (categoryId, categoryData) => {
        try {
            const backendData = mapCategoryToBackend(categoryData);
            const response = await api.put(`/categories/${categoryId}`, backendData);
            const category = response.data.data || response.data;
            return mapCategoryFromBackend(category);
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    /**
     * Delete category
     * @param {number} categoryId - Category ID
     * @returns {Promise}
     */
    deleteCategory: async (categoryId) => {
        try {
            const response = await api.delete(`/inventory/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    // ============= SUBCATEGORIES =============
    /**
     * Get all subcategories
     * @returns {Promise} Array of subcategories
     */
    getSubCategories: async () => {
        try {
            const response = await api.get('/inventory/subcategories');
            const subcategories = response.data.data || response.data;
            return mapSubCategoriesFromBackend(subcategories);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            throw error;
        }
    },

    /**
     * Create new subcategory
     * @param {Object} subCategoryData
     * @returns {Promise} Created subcategory
     */
    createSubCategory: async (subCategoryData) => {
        try {
            // eslint-disable-next-line no-unused-vars
            const { subcategory_id, ...rest } = subCategoryData;
            const backendData = mapSubCategoryToBackend(rest);
            const response = await api.post('/inventory/subcategories', backendData);
            const subCategory = response.data.data || response.data;
            return mapSubCategoryFromBackend(subCategory);
        } catch (error) {
            console.error('Error creating subcategory:', error);
            throw error;
        }
    },

    /**
     * Update subcategory
     * @param {number} subCategoryId
     * @param {Object} subCategoryData
     * @returns {Promise} Updated subcategory
     */
    updateSubCategory: async (subCategoryId, subCategoryData) => {
        try {
            const backendData = mapSubCategoryToBackend(subCategoryData);
            const response = await api.put(`/subcategories/${subCategoryId}`, backendData);
            const subCategory = response.data.data || response.data;
            return mapSubCategoryFromBackend(subCategory);
        } catch (error) {
            console.error('Error updating subcategory:', error);
            throw error;
        }
    },

    /**
     * Delete subcategory
     * @param {number} subCategoryId
     * @returns {Promise}
     */
    deleteSubCategory: async (subCategoryId) => {
        try {
            const response = await api.delete(`/inventory/subcategories/${subCategoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            throw error;
        }
    },

    // ============= BRANDS =============

    /**
     * Get all brands
     * @returns {Promise} Array of brands in frontend format
     */
    getBrands: async () => {
        try {
            console.log('[InventoryService] GET brands');
            const response = await api.get('/inventory/brands');
            console.log('[InventoryService] GET brands response:', response.data);
            const brands = response.data.data || response.data;
            const mapped = mapBrandsFromBackend(brands);
            console.log('[InventoryService] GET brands mapped:', mapped.length, 'items');
            return mapped;
        } catch (error) {
            console.error('[InventoryService] GET brands error:', error?.response || error);
            throw error;
        }
    },

    /**
     * Get brand by ID
     * @param {number} brandId - Brand ID
     * @returns {Promise} Brand object
     */
    getBrandById: async (brandId) => {
        try {
            const response = await api.get(`/inventory/brands/${brandId}`);
            const brand = response.data.data || response.data;
            return mapBrandFromBackend(brand);
        } catch (error) {
            console.error('Error fetching brand:', error);
            throw error;
        }
    },

    /**
     * Create new brand
     * @param {Object} brandData - Brand data in frontend format
     * @returns {Promise} Created brand
     */
    createBrand: async (brandData) => {
        try {
            // eslint-disable-next-line no-unused-vars
            const { brand_id, ...rest } = brandData;
            const backendData = mapBrandToBackend(rest);
            const response = await api.post('/inventory/brands', backendData);
            const brand = response.data.data || response.data;
            return mapBrandFromBackend(brand);
        } catch (error) {
            console.error('Error creating brand:', error);
            throw error;
        }
    },

    /**
     * Update brand
     * @param {number} brandId - Brand ID
     * @param {Object} brandData - Brand data in frontend format
     * @returns {Promise} Updated brand
     */
    updateBrand: async (brandId, brandData) => {
        try {
            const backendData = mapBrandToBackend(brandData);
            const response = await api.put(`/brands/${brandId}`, backendData);
            const brand = response.data.data || response.data;
            return mapBrandFromBackend(brand);
        } catch (error) {
            console.error('Error updating brand:', error);
            throw error;
        }
    },

    /**
     * Delete brand
     * @param {number} brandId - Brand ID
     * @returns {Promise}
     */
    deleteBrand: async (brandId) => {
        try {
            const response = await api.delete(`/inventory/brands/${brandId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting brand:', error);
            throw error;
        }
    },




    // ============= BRANCHES =============

    /**
     * Get all branches
     * @returns {Promise} Array of branches in frontend format
     */
    getBranches: async () => {
        try {
            console.log('[InventoryService] GET branches');
            const response = await api.get('/inventory/branches');
            console.log('[InventoryService] GET branches response:', response.data);
            const branches = response.data.data || response.data;
            const mapped = mapBranchesFromBackend(branches);
            console.log('[InventoryService] GET branches mapped:', mapped.length, 'items');
            return mapped;
        } catch (error) {
            console.error('[InventoryService] GET branches error:', error?.response || error);
            throw error;
        }
    },

    // ============= GRNS =============

    /**
     * Get all GRNs for a branch
     * @param {number} branchId - Branch ID
     * @returns {Promise} Array of GRNs in frontend format
     */
    getGRNs: async (branchId) => {
        try {
            console.log('[InventoryService] GET GRNs for branch:', branchId);
            // If no branchId provided, get from localStorage or use default
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const effectiveBranchId = branchId || user.branchId || 1;
            
            const response = await api.get(`/inventory/grn/branch/${effectiveBranchId}`);
            const grns = response.data.data || response.data;
            const mapped = mapGRNsFromBackend(grns);
            console.log('[InventoryService] GET GRNs mapped:', mapped.length, 'items');
            return mapped;
        } catch (error) {
            console.error('[InventoryService] Error fetching GRNs:', error);
            throw error;
        }
    },

    /**
     * Search GRNs with filters
     * @param {Object} filter - Filter object { branchId, supplierId, status, paymentStatus, startDate, endDate, grnNo, invoiceNo }
     * @returns {Promise} Array of GRNs
     */
    searchGRNs: async (filter = {}) => {
        try {
            console.log('[InventoryService] Search GRNs with filter:', filter);
            const backendFilter = mapGRNToBackend(filter);
            const response = await api.post('/inventory/grn/search', backendFilter);
            const grns = response.data.data || response.data;
            return mapGRNsFromBackend(grns);
        } catch (error) {
            console.error('[InventoryService] Error searching GRNs:', error);
            throw error;
        }
    },

    /**
     * Get pending GRNs for approval
     * @param {number} branchId - Optional branch ID filter
     * @returns {Promise} Array of pending GRNs
     */
    getPendingGRNs: async (branchId) => {
        try {
            console.log('[InventoryService] GET pending GRNs for branch:', branchId);
            const response = await api.get('/inventory/grn/pending', {
                params: branchId ? { branchId } : {}
            });
            const grns = response.data.data || response.data;
            return mapGRNsFromBackend(grns);
        } catch (error) {
            console.error('[InventoryService] Error fetching pending GRNs:', error);
            throw error;
        }
    },

    /**
     * Get GRN by ID
     * @param {number} grnId - GRN ID
     * @returns {Promise} GRN object in frontend format
     */
    getGRNById: async (grnId) => {
        try {
            console.log('[InventoryService] GET GRN by ID:', grnId);
            const response = await api.get(`/inventory/grn/${grnId}`);
            const grn = response.data.data || response.data;
            return mapGRNFromBackend(grn);
        } catch (error) {
            console.error('[InventoryService] Error fetching GRN:', error);
            throw error;
        }
    },

    /**
     * Create new GRN
     * @param {Object} grnData - GRN data in frontend format (snake_case)
     * @returns {Promise} Created GRN
     */
    createGRN: async (grnData) => {
        try {
            console.log('[InventoryService] Create GRN:', grnData);
            
            // Transform GRN data to backend format
            const backendData = {
                branchId: grnData.branch_id,
                supplierId: grnData.supplier_id,
                poId: grnData.po_id || null,
                grnDate: grnData.grn_date,
                invoiceNo: grnData.invoice_no,
                invoiceDate: grnData.invoice_date,
                items: grnData.items.map(item => ({
                    productId: item.product_id,
                    batchCode: item.batch_code || null,
                    expiryDate: item.expiry_date || null,
                    qtyReceived: item.quantity,
                    unitPrice: item.unit_price
                }))
            };
            
            console.log('[InventoryService] Create GRN backend data:', backendData);
            
            // Get current user ID
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.userId || user.id || 1;
            
            const response = await api.post('/inventory/grn', backendData, {
                headers: {
                    'User-ID': userId
                }
            });
            
            const grn = response.data.data || response.data;
            console.log('[InventoryService] Create GRN response:', grn);
            return mapGRNFromBackend(grn);
        } catch (error) {
            console.error('[InventoryService] Error creating GRN:', error);
            console.error('[InventoryService] Error details:', error.response?.data);
            throw error;
        }
    },

    /**
     * Update GRN (only if pending)
     * @param {number} grnId - GRN ID
     * @param {Object} grnData - GRN update data
     * @returns {Promise} Updated GRN
     */
    updateGRN: async (grnId, grnData) => {
        try {
            console.log('[InventoryService] Update GRN:', grnId, grnData);
            
            const backendData = {
                grnDate: grnData.grn_date,
                invoiceNo: grnData.invoice_no,
                invoiceDate: grnData.invoice_date,
                items: grnData.items?.map(item => ({
                    productId: item.product_id,
                    batchCode: item.batch_code || null,
                    expiryDate: item.expiry_date || null,
                    qtyReceived: item.quantity,
                    unitPrice: item.unit_price
                }))
            };
            
            const response = await api.put(`/inventory/grn/${grnId}`, backendData);
            const grn = response.data.data || response.data;
            return mapGRNFromBackend(grn);
        } catch (error) {
            console.error('[InventoryService] Error updating GRN:', error);
            throw error;
        }
    },

    /**
     * Approve GRN
     * @param {number} grnId - GRN ID
     * @returns {Promise} Approved GRN
     */
    approveGRN: async (grnId) => {
        try {
            console.log('[InventoryService] Approve GRN:', grnId);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.userId || user.id || 1;
            
            const response = await api.put(`/inventory/grn/${grnId}/approve`, {}, {
                headers: {
                    'User-ID': userId
                }
            });
            const grn = response.data.data || response.data;
            return mapGRNFromBackend(grn);
        } catch (error) {
            console.error('[InventoryService] Error approving GRN:', error);
            throw error;
        }
    },

    /**
     * Reject GRN
     * @param {number} grnId - GRN ID
     * @param {string} reason - Rejection reason
     * @returns {Promise} Rejected GRN
     */
    rejectGRN: async (grnId, reason) => {
        try {
            console.log('[InventoryService] Reject GRN:', grnId, reason);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.userId || user.id || 1;
            
            const response = await api.put(`/inventory/grn/${grnId}/reject`, {}, {
                headers: {
                    'User-ID': userId
                },
                params: {
                    reason: reason
                }
            });
            const grn = response.data.data || response.data;
            return mapGRNFromBackend(grn);
        } catch (error) {
            console.error('[InventoryService] Error rejecting GRN:', error);
            throw error;
        }
    },

    /**
     * Update GRN payment status
     * @param {number} grnId - GRN ID
     * @param {string} paymentStatus - Payment status (UNPAID, PARTIALLY_PAID, PAID)
     * @returns {Promise} Updated GRN
     */
    updateGRNPaymentStatus: async (grnId, paymentStatus) => {
        try {
            console.log('[InventoryService] Update GRN payment status:', grnId, paymentStatus);
            const response = await api.put(`/inventory/grn/${grnId}/payment-status`, null, {
                params: { paymentStatus }
            });
            const grn = response.data.data || response.data;
            return mapGRNFromBackend(grn);
        } catch (error) {
            console.error('[InventoryService] Error updating GRN payment status:', error);
            throw error;
        }
    },

    /**
     * Delete GRN (only if pending)
     * @param {number} grnId - GRN ID
     * @returns {Promise}
     */
    deleteGRN: async (grnId) => {
        try {
            console.log('[InventoryService] Delete GRN:', grnId);
            const response = await api.delete(`/inventory/grn/${grnId}`);
            return response.data;
        } catch (error) {
            console.error('[InventoryService] Error deleting GRN:', error);
            throw error;
        }
    },

    /**
     * Get GRN statistics for a branch
     * @param {number} branchId - Branch ID
     * @param {string} period - Optional period filter
     * @returns {Promise} GRN statistics
     */
    getGRNStats: async (branchId, period) => {
        try {
            console.log('[InventoryService] GET GRN stats:', branchId, period);
            const params = period ? { period } : {};
            const response = await api.get(`/inventory/grn/branch/${branchId}/stats`, { params });
            const stats = response.data.data || response.data;
            return mapGRNFromBackend(stats);
        } catch (error) {
            console.error('[InventoryService] Error fetching GRN stats:', error);
            throw error;
        }
    },

    /**
     * Get GRN items by product
     * @param {number} productId - Product ID
     * @param {number} branchId - Optional branch ID filter
     * @returns {Promise} Array of GRN items
     */
    getGRNItemsByProduct: async (productId, branchId) => {
        try {
            console.log('[InventoryService] GET GRN items by product:', productId, branchId);
            const params = branchId ? { branchId } : {};
            const response = await api.get(`/inventory/grn/product/${productId}/items`, { params });
            const items = response.data.data || response.data;
            return mapGRNsFromBackend(items);
        } catch (error) {
            console.error('[InventoryService] Error fetching GRN items by product:', error);
            throw error;
        }
    },

    /**
     * Get GRNs by supplier
     * @param {number} supplierId - Supplier ID
     * @returns {Promise} Array of GRNs
     */
    getGRNsBySupplier: async (supplierId) => {
        try {
            console.log('[InventoryService] GET GRNs by supplier:', supplierId);
            const response = await api.get(`/inventory/grn/supplier/${supplierId}`);
            const grns = response.data.data || response.data;
            return mapGRNsFromBackend(grns);
        } catch (error) {
            console.error('[InventoryService] Error fetching GRNs by supplier:', error);
            throw error;
        }
    },

    /**
     * Check if GRN number exists
     * @param {string} grnNo - GRN number
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    checkGRNNumber: async (grnNo) => {
        try {
            console.log('[InventoryService] Check GRN number:', grnNo);
            const response = await api.get(`/inventory/grn/check-number/${grnNo}`);
            return response.data.data || response.data;
        } catch (error) {
            console.error('[InventoryService] Error checking GRN number:', error);
            throw error;
        }
    },

    // ============= SUPPLIERS =============

    /**
     * Get all suppliers
     * @returns {Promise} Array of suppliers in frontend format
     */
    getSuppliers: async () => {
        try {
            console.log('[InventoryService] GET suppliers');
            const response = await api.get('/inventory/suppliers');
            console.log('[InventoryService] GET suppliers response:', response.data);
            const suppliers = response.data.data || response.data;
            const mapped = mapSuppliersFromBackend(suppliers);
            console.log('[InventoryService] GET suppliers mapped:', mapped.length, 'items');
            return mapped;
        } catch (error) {
            console.error('[InventoryService] GET suppliers error:', error?.response || error);
            throw error;
        }
    },

    /**
     * Get supplier by ID
     * @param {number} supplierId - Supplier ID
     * @returns {Promise} Supplier object
     */
    getSupplierById: async (supplierId) => {
        try {
            const response = await api.get(`/inventory/suppliers/${supplierId}`);
            const supplier = response.data.data || response.data;
            return mapSupplierFromBackend(supplier);
        } catch (error) {
            console.error('Error fetching supplier:', error);
            throw error;
        }
    },

    /**
     * Create new supplier
     * @param {Object} supplierData - Supplier data in frontend format
     * @returns {Promise} Created supplier
     */
    createSupplier: async (supplierData) => {
        try {
            // Remove supplier_id if it's empty to avoid sending empty string as ID
            // eslint-disable-next-line no-unused-vars
            const { supplier_id, ...rest } = supplierData;

            // Add required fields for backend
            const dataWithDefaults = {
                ...rest,
                contacts: rest.contacts || [],
                branches: rest.branches || [],
                createdBy: rest.createdBy || 1
            };

            const backendData = mapSupplierToBackend(dataWithDefaults);
            console.log('[InventoryService] Creating supplier with data:', backendData);

            const response = await api.post('/inventory/suppliers', backendData);
            const supplier = response.data.data || response.data;
            return mapSupplierFromBackend(supplier);
        } catch (error) {
            console.error('Error creating supplier:', error);
            if (error.response) {
                console.error('Backend validation errors:', error.response.data);
            }
            throw error;
        }
    },

    /**
     * Update supplier
     * @param {number} supplierId - Supplier ID
     * @param {Object} supplierData - Supplier data in frontend format
     * @returns {Promise} Updated supplier
     */
    updateSupplier: async (supplierId, supplierData) => {
        try {
            const backendData = mapSupplierToBackend(supplierData);
            const response = await api.put(`/suppliers/${supplierId}`, backendData);
            const supplier = response.data.data || response.data;
            return mapSupplierFromBackend(supplier);
        } catch (error) {
            console.error('Error updating supplier:', error);
            throw error;
        }
    },

    /**
     * Delete supplier
     * @param {number} supplierId - Supplier ID
     * @returns {Promise}
     */
    deleteSupplier: async (supplierId) => {
        try {
            const response = await api.delete(`/inventory/suppliers/${supplierId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting supplier:', error);
            throw error;
        }
    }
};

export default inventoryService;
