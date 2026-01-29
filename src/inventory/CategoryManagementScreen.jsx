import React from 'react';
import { Plus, Tag, Edit, Trash2, X, Search } from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
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
                    <button onClick={() => setIsAddCategoryOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2 hover:bg-brand-secondary transition-colors btn-hover-scale btn-interactive">
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {filteredCategories.map((cat) => (
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


        </div>
    );
};

export default CategoryManagementScreen;
