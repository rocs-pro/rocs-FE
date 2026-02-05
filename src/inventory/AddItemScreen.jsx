import React, { useState } from 'react';
import inventoryService from '../services/inventoryService';
import { useInventoryNotification } from './context/InventoryNotificationContext';

const AddItemScreen = ({ onClose, setActiveScreen, categories, subCategories = [], brands, onSaved, itemToEdit }) => {
    const { success, error, warning } = useInventoryNotification();
    const [formData, setFormData] = useState({
        sku: '',
        barcode: '',
        name: '',
        description: '',
        category_id: '',
        subcategory_id: '',
        brand_id: '',
        unit: '',
        cost_price: '',
        selling_price: '',
        mrp: '',
        tax_rate: '0',
        reorder_level: '10',
        is_active: true
    });

    React.useEffect(() => {
        if (itemToEdit) {
            setFormData({
                sku: itemToEdit.sku || '',
                barcode: itemToEdit.barcode || '',
                name: itemToEdit.name || '',
                description: itemToEdit.description || '',
                category_id: itemToEdit.category_id || '',
                subcategory_id: itemToEdit.subcategory_id || '',
                brand_id: itemToEdit.brand_id || '',
                unit: itemToEdit.unit || '',
                cost_price: itemToEdit.cost_price || '',
                selling_price: itemToEdit.selling_price || '',
                mrp: itemToEdit.mrp || '',
                tax_rate: itemToEdit.tax_rate || '0',
                reorder_level: itemToEdit.reorder_level || '10',
                is_active: itemToEdit.is_active !== undefined ? itemToEdit.is_active : true
            });
        }
    }, [itemToEdit]);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.sku.trim()) {
            warning('SKU is required');
            return false;
        }
        if (!formData.name.trim()) {
            warning('Product Name is required');
            return false;
        }
        if (!formData.category_id) {
            warning('Category is required');
            return false;
        }
        if (!formData.cost_price || parseFloat(formData.cost_price) <= 0) {
            warning('Valid Cost Price is required');
            return false;
        }
        if (!formData.selling_price || parseFloat(formData.selling_price) <= 0) {
            warning('Valid Selling Price is required');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Convert string numbers to actual numbers for the API
            const payload = {
                ...formData,
                category_id: parseInt(formData.category_id),
                subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
                brand_id: formData.brand_id ? parseInt(formData.brand_id) : null,
                cost_price: parseFloat(formData.cost_price),
                selling_price: parseFloat(formData.selling_price),
                mrp: formData.mrp ? parseFloat(formData.mrp) : parseFloat(formData.selling_price),
                tax_rate: parseFloat(formData.tax_rate),
                reorder_level: parseInt(formData.reorder_level)
            };

            let savedProduct;
            if (itemToEdit) {
                savedProduct = await inventoryService.updateProduct(itemToEdit.product_id, payload);
            } else {
                savedProduct = await inventoryService.createProduct(payload);
            }

            // Call parent callback to add item to list
            if (onSaved) {
                onSaved(savedProduct);
            }

            success(itemToEdit ? 'Product updated successfully!' : 'Product created successfully!');

            // Close modal
            if (onClose) {
                onClose();
            } else {
                setActiveScreen('item-list');
            }
        } catch (err) {
            console.error('Error saving product:', err);
            error('Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key to move to next field (forward only)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();

            // Get all input/select/textarea elements (exclude buttons)
            const form = e.target.form;
            if (!form) return;

            const focusableElements = Array.from(
                form.querySelectorAll('input:not([disabled]):not([type="button"]), select:not([disabled]), textarea:not([disabled])')
            );

            const currentIndex = focusableElements.indexOf(e.target);
            const nextIndex = currentIndex + 1;

            // Move to next element only if not at the end
            if (nextIndex < focusableElements.length) {
                focusableElements[nextIndex].focus();
            } else {
                // At the last field, trigger save
                handleSave();
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Add New Item</h2>
                    <p className="text-gray-600 mt-1">Create a new inventory item</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
                )}
            </div>

            <form className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            placeholder="BEV-CC-001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
                        <input
                            type="text"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1234567890123"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Product description"
                            rows="2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full text-base"
                        >
                            <option value="">Select category</option>
                            {categories && categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                        <select
                            name="subcategory_id"
                            value={formData.subcategory_id}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full text-base"
                            disabled={!formData.category_id}
                        >
                            <option value="">Select subcategory</option>
                            {subCategories
                                .filter(sc => sc.category_id === parseInt(formData.category_id))
                                .map(sc => (
                                    <option key={sc.subcategory_id} value={sc.subcategory_id}>
                                        {sc.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <select
                            name="brand_id"
                            value={formData.brand_id}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full text-base"
                        >
                            <option value="">Select brand</option>
                            {brands && brands.map(brand => (
                                <option key={brand.brand_id} value={brand.brand_id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full text-base"
                        >
                            <option value="">Select unit</option>
                            <option value="PIECE">Piece</option>
                            <option value="BOX">Box</option>
                            <option value="PACK">Pack</option>
                            <option value="LITER">Liter</option>
                            <option value="KG">Kilogram</option>
                            <option value="GRAM">Gram</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
                        <input
                            type="number"
                            name="reorder_level"
                            value={formData.reorder_level}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price *</label>
                        <input
                            type="number"
                            name="cost_price"
                            value={formData.cost_price}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price *</label>
                        <input
                            type="number"
                            name="selling_price"
                            value={formData.selling_price}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">MRP (Maximum Retail Price)</label>
                        <input
                            type="number"
                            name="mrp"
                            value={formData.mrp}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                        <input
                            type="number"
                            name="tax_rate"
                            value={formData.tax_rate}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => onClose ? onClose() : setActiveScreen('item-list')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Item'}
                    </button>
                </div>
            </form>
        </div >
    );
};

export default AddItemScreen;

