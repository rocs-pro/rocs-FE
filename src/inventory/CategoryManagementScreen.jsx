import React from 'react';
import { Plus, Tag, Edit, Trash2, X } from 'lucide-react';

const CategoryManagementScreen = ({ 
    categories, 
    categoryForm, 
    setCategoryForm, 
    isAddCategoryOpen, 
    setIsAddCategoryOpen, 
    handleAddCategory,
    handleDeleteCategory,
    handleEditCategory,
    isEditMode,
    handleSaveEdit
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                    <p className="text-gray-600 mt-1">Organize your inventory categories</p>
                </div>
                <button onClick={() => setIsAddCategoryOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2 hover:bg-brand-secondary transition-colors">
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <div key={cat.category_id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-blue-50">
                                <Tag size={24} className="text-brand-primary" />
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEditCategory(cat.category_id)} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDeleteCategory(cat.category_id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{cat.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Category Modal */}
            {isAddCategoryOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{isEditMode ? 'Edit Category' : 'Add New Category'}</h3>
                            <button onClick={() => setIsAddCategoryOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    placeholder="e.g., Beverages"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                    placeholder="e.g., Drinks and beverages"
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={categoryForm.is_active}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                                    id="isActive"
                                    className="rounded"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setIsAddCategoryOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={isEditMode ? handleSaveEdit : handleAddCategory}
                                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary"
                            >
                                {isEditMode ? 'Save Changes' : 'Add Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagementScreen;
