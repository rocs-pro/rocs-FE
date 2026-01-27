import React from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Brand Management</h2>
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
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Brand ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Brand Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredBrands.map((b) => (
                            <tr key={b.brand_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-mono text-gray-900">{b.brand_id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{b.description}</td>
                                <td className="px-6 py-4 text-sm text-gray-600"><span className={`px-2 py-1 rounded-full text-xs font-medium ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.is_active ? 'Active' : 'Inactive'}</span></td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleEditBrand(b.brand_id)} className="p-1.5 text-brand-primary hover:bg-blue-50 rounded"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteBrand(b.brand_id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Brand Modal */}
            {isAddBrandOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center animate-modal-blur">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddBrandOpen(false)}></div>
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 z-10 max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Add Brand</h2>
                                        <p className="text-gray-600 mt-1">Create a new brand</p>
                                    </div>
                                    <button onClick={() => setIsAddBrandOpen(false)} className="text-gray-500 hover:text-gray-700">×</button>
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
                                            <input value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Brand name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                            <textarea value={brandForm.description} onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Short description" rows="2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                            <select value={brandForm.is_active} onChange={(e) => setBrandForm({ ...brandForm, is_active: e.target.value === 'true' })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                                        <button onClick={() => { setIsAddBrandOpen(false); setBrandForm({ brand_id: '', name: '', description: '', is_active: true }); }} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                                        <button onClick={() => { if (!brandForm.name) { alert('Please fill required fields'); return; } setBrands([...brands, { ...brandForm, brand_id: Math.max(...brands.map(b => b.brand_id), 0) + 1, created_at: new Date().toISOString().split('T')[0] }]); setIsAddBrandOpen(false); setBrandForm({ brand_id: '', name: '', description: '', is_active: true }); }} className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors">Save Brand</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandManagementScreen;
