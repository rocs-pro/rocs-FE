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
    mapSuppliersFromBackend
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
            const response = await api.get('/products');
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
            const response = await api.get(`/products/${productId}`);
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
            const response = await api.post('/products', backendData);
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
            const response = await api.put(`/products/${productId}`, backendData);
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
            const response = await api.delete(`/products/${productId}`);
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
            const response = await api.get('/categories');
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
            const response = await api.get(`/categories/${categoryId}`);
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
            console.log('[InventoryService] POST category:', categoryData);
            const backendData = mapCategoryToBackend(categoryData);
            console.log('[InventoryService] POST category (mapped):', backendData);
            const response = await api.post('/categories', backendData);
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
            const response = await api.delete(`/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
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
            const response = await api.get('/brands');
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
            const response = await api.get(`/brands/${brandId}`);
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
            const backendData = mapBrandToBackend(brandData);
            const response = await api.post('/brands', backendData);
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
            const response = await api.delete(`/brands/${brandId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting brand:', error);
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
            const response = await api.get('/suppliers');
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
            const response = await api.get(`/suppliers/${supplierId}`);
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
            const backendData = mapSupplierToBackend(supplierData);
            const response = await api.post('/suppliers', backendData);
            const supplier = response.data.data || response.data;
            return mapSupplierFromBackend(supplier);
        } catch (error) {
            console.error('Error creating supplier:', error);
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
            const response = await api.delete(`/suppliers/${supplierId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting supplier:', error);
            throw error;
        }
    }
};

export default inventoryService;
