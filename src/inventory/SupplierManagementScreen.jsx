import React from 'react';
import { Plus, Edit, Trash2, Archive, Search } from 'lucide-react';

const SupplierManagementScreen = ({
    suppliers,
    setSuppliers,
    isAddSupplierOpen,
    setIsAddSupplierOpen,
    supplierForm,
    setSupplierForm,
    categories,
    handleDeleteSupplier,
    handleEditSupplier,
    isEditMode,
    handleSaveEdit
}) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 drop-shadow-sm">Supplier Management</h2>
                    <p className="text-gray-600 mt-1">Manage your suppliers</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-64"
                        />
                    </div>
                    <button onClick={() => setIsAddSupplierOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2 hover:bg-brand-secondary transition-colors btn-hover-scale btn-interactive">
                        <Plus size={20} />
                        Add Supplier
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Supplier Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Company & Code</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map((s) => (
                                <tr key={s.supplier_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-50">
                                                <Archive size={16} className="text-brand-primary" />
                                            </div>
                                            {s.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="text-gray-900 font-medium">{s.company_name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{s.code}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{s.supplier_type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{s.phone}</td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditSupplier(s.supplier_id)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSupplier(s.supplier_id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No suppliers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


        </div>
    );
};

export default SupplierManagementScreen;
