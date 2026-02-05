import React, { useState } from 'react';
import {
    Plus, Tag, Edit, Trash2, X, Search, ChevronDown, ChevronRight, MoreVertical, FolderPlus,
    Box, Archive, Layers, ShoppingBag, Coffee, Smartphone, Headphones, Shirt, Watch, Utensils, Zap, Gift, Briefcase, Camera, Music, Anchor, Globe, Key, Map, Sun, Moon, Star, Heart
} from 'lucide-react';

const CategoryManagementScreen = ({
    categories,
    subCategories,
    categoryForm,
    setCategoryForm,
    isAddCategoryOpen,
    setIsAddCategoryOpen,
    handleAddCategory,
    handleDeleteCategory,
    handleEditCategory,
    isEditMode,
    handleSaveEdit,
    subCategoryForm,
    setSubCategoryForm,
    isAddSubCategoryOpen,
    setIsAddSubCategoryOpen,
    handleAddSubCategory,
    setSelectedParentCategory,
    handleDeleteSubCategory,
    handleEditSubCategory
}) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Derived filtered categories
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    // Helper to get subcategories for a specific category
    const getSubCategoriesForCategory = (categoryId) => {
        return subCategories ? subCategories.filter(sc => sc.category_id === categoryId) : [];
    };

    const ICON_MAP = {
        Tag, Box, Archive, Layers, ShoppingBag, Coffee, Smartphone, Headphones, Shirt, Watch, Utensils, Zap, Gift, Briefcase, Camera, Music, Anchor, Globe, Key, Map, Sun, Moon, Star, Heart
    };

    const COLOR_MAP = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
        pink: 'bg-pink-100 text-pink-600',
        orange: 'bg-orange-100 text-orange-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        teal: 'bg-teal-100 text-teal-600',
        cyan: 'bg-cyan-100 text-cyan-600',
    };

    return (
        <div className="flex h-full gap-6" onClick={() => setActiveDropdown(null)}>
            <div className={`flex-1 flex flex-col space-y-6 transition-all duration-300 ${selectedCategory ? 'w-2/3' : 'w-full'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 drop-shadow-sm">Category Management</h2>
                        <p className="text-gray-600 mt-1">Organize your inventory categories</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-64"
                            />
                        </div>
                        <button
                            onClick={() => setIsAddCategoryOpen(true)}
                            className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2 hover:bg-brand-secondary transition-colors btn-hover-scale btn-interactive"
                        >
                            <Plus size={20} />
                            Add Category
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">#</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">Category Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">Description</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat, index) => {
                                        const categorySubCats = getSubCategoriesForCategory(cat.category_id);
                                        const isSelected = selectedCategory?.category_id === cat.category_id;
                                        const IconComponent = ICON_MAP[cat.icon] || Tag;
                                        const colorClass = COLOR_MAP[cat.color] || 'bg-gray-100 text-gray-500';

                                        return (
                                            <tr
                                                key={cat.category_id}
                                                className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50 ring-1 ring-inset ring-blue-500/20' : ''}`}
                                                onClick={() => setSelectedCategory(isSelected ? null : cat)}
                                            >
                                                <td className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : colorClass}`}>
                                                            <IconComponent size={18} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>{cat.name}</span>
                                                            <span className="text-xs text-gray-500">
                                                                {categorySubCats.length} subcategories
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{cat.description || '-'}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {cat.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right relative">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Open actions dropdown
                                                                toggleDropdown(cat.category_id);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>

                                                        {selectedCategory?.category_id !== cat.category_id && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedCategory(cat);
                                                                }}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                            >
                                                                <ChevronRight size={18} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {activeDropdown === cat.category_id && (
                                                        <div className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 animate-in fade-in zoom-in duration-200">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditCategory(cat.category_id);
                                                                    setActiveDropdown(null);
                                                                }}
                                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <Edit size={14} /> Edit Category
                                                            </button>

                                                            <div className="h-px bg-gray-100 my-1"></div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteCategory(cat.category_id);
                                                                    setActiveDropdown(null);
                                                                }}
                                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            >
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Tag size={48} className="mb-4 text-gray-300" />
                                                <p className="text-lg font-medium text-gray-900">No Categories Found</p>
                                                <p className="text-sm mt-1">Get started by creating a new category.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Side Panel for Subcategories */}
            {selectedCategory && (
                <div className="w-1/3 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col animate-in slide-in-from-right-10 duration-300">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                        <div>
                            <h3 className="font-bold text-gray-900">{selectedCategory.name}</h3>
                            <p className="text-xs text-gray-500">Subcategories</p>
                        </div>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto">
                        <button
                            onClick={() => {
                                setIsAddSubCategoryOpen(true);
                                setSelectedParentCategory(selectedCategory.category_id);
                            }}
                            className="w-full mb-4 py-2 px-4 border border-dashed border-blue-300 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:border-blue-400 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <Plus size={16} /> Add New Subcategory
                        </button>

                        <div className="space-y-3">
                            {getSubCategoriesForCategory(selectedCategory.category_id).length > 0 ? (
                                getSubCategoriesForCategory(selectedCategory.category_id).map(sub => (
                                    <div key={sub.subcategory_id} className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">{sub.name}</div>
                                            {sub.description && <div className="text-xs text-gray-500 mt-0.5">{sub.description}</div>}
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditSubCategory(sub.subcategory_id)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSubCategory(sub.subcategory_id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FolderPlus size={24} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm">No subcategories yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagementScreen;
