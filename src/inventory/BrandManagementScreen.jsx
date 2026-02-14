import React from 'react';
import { Plus, Edit, Trash2, Search, Archive, Tag, Box, Layers, ShoppingBag, Coffee, Smartphone, Headphones, Shirt, Watch, Utensils, Zap, Gift, Briefcase, Camera, Music, Anchor, Globe, Key, Map, Sun, Moon, Star, Heart } from 'lucide-react';

const BrandManagementScreen = ({
    brands,
    setBrands,
    isAddBrandOpen,
    setIsAddBrandOpen,
    brandForm,
    setBrandForm,
    suppliers,
    handleDeleteBrand,
    handleEditBrand,
    isEditMode,
    handleSaveEdit
}) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ICON_MAP = {
        Archive, Tag, Box, Layers, ShoppingBag, Coffee, Smartphone, Headphones, Shirt, Watch, Utensils, Zap, Gift, Briefcase, Camera, Music, Anchor, Globe, Key, Map, Sun, Moon, Star, Heart
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 drop-shadow-sm">Brand Management</h2>
                    <p className="text-gray-600 mt-1">Manage brand list, suppliers and units</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-64"
                        />
                    </div>
                    <button onClick={() => setIsAddBrandOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2 hover:bg-brand-secondary transition-colors">
                        <Plus size={20} /> Add Brand
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-16">No.</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Brand Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredBrands.length > 0 ? (
                            filteredBrands.map((b, index) => {
                                const IconComponent = ICON_MAP[b.icon] || Archive;
                                const colorClass = COLOR_MAP[b.color] || 'bg-gray-100 text-gray-500';

                                return (
                                    <tr key={b.brand_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${colorClass}`}>
                                                    <IconComponent size={18} />
                                                </div>
                                                <span className="font-medium text-gray-900">{b.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{b.description || '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {b.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditBrand(b.brand_id)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBrand(b.brand_id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <Archive size={48} className="mb-4 text-gray-300" />
                                        <p className="text-lg font-medium text-gray-900">No Brands Found</p>
                                        <p className="text-sm mt-1">Get started by creating a new brand.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


        </div>
    );
};

export default BrandManagementScreen;
