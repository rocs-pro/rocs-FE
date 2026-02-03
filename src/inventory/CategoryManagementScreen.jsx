import React, { useState } from 'react';
import { Plus, Tag, Edit, Trash2, X, Search, ChevronDown, ChevronRight, MoreVertical, FolderPlus } from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Derived filtered categories
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    // Helper to get subcategories for a specific category
    const getSubCategoriesForCategory = (categoryId) => {
        return subCategories ? subCategories.filter(sc => sc.category_id === categoryId) : [];
    };

    return (
        <div className="space-y-6" onClick={() => setActiveDropdown(null)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                    <p className="text-gray-600 mt-1">Organize your inventory categories and subcategories</p>
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

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">Category Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">Description</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => {
                                    const categorySubCats = getSubCategoriesForCategory(cat.category_id);
                                    const isExpanded = expandedCategories[cat.category_id];

                                    return (
                                        <React.Fragment key={cat.category_id}>
                                            <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => toggleExpand(cat.category_id)}
                                                            className={`p-1 rounded-md hover:bg-gray-200 transition-colors ${categorySubCats.length === 0 ? 'invisible' : ''}`}
                                                        >
                                                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                        </button>
                                                        <div className="p-2 rounded-lg bg-blue-100 text-brand-primary">
                                                            <Tag size={18} />
                                                        </div>
                                                        <span className="font-medium text-gray-900">{cat.name}</span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                            {categorySubCats.length} sub
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{cat.description || '-'}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {cat.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right relative">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsAddSubCategoryOpen(true);
                                                                setSelectedParentCategory(cat.category_id);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                            title="Add Subcategory"
                                                        >
                                                            <FolderPlus size={18} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleDropdown(cat.category_id);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </div>

                                                    {activeDropdown === cat.category_id && (
                                                        <div className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 animate-in fade-in zoom-in duration-200">
                                                            <button
                                                                onClick={() => {
                                                                    handleEditCategory(cat.category_id);
                                                                    setActiveDropdown(null);
                                                                }}
                                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <Edit size={14} /> Edit Category
                                                            </button>

                                                            <div className="h-px bg-gray-100 my-1"></div>
                                                            <button
                                                                onClick={() => {
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

                                            {/* Subcategories Row */}
                                            {isExpanded && categorySubCats.length > 0 && (
                                                <tr className="bg-gray-50/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <td colSpan="4" className="pl-16 pr-6 py-4">
                                                        <div className="space-y-2">
                                                            {categorySubCats.map(sub => (
                                                                <div key={sub.subcategory_id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></div>
                                                                        <span className="text-sm font-medium text-gray-800">{sub.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <span className={`text-xs px-2 py-0.5 rounded ${sub.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                            {sub.is_active ? 'Active' : 'Inactive'}
                                                                        </span>
                                                                        <div className="flex gap-1">
                                                                            <button
                                                                                onClick={() => handleEditSubCategory(sub.subcategory_id)}
                                                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                                            >
                                                                                <Edit size={12} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteSubCategory(sub.subcategory_id)}
                                                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                            {isExpanded && categorySubCats.length === 0 && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan="4" className="text-center py-6 text-gray-500 text-sm italic">
                                                        No subcategories found. Add one to get started.
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
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
    );
};

export default CategoryManagementScreen;
