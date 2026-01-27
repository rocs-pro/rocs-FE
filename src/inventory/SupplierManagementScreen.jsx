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
                    <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
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

            <div className="grid grid-cols-4 gap-4">
                {filteredSuppliers.map((s) => (
                    <div key={s.supplier_id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-blue-50">
                                <Archive size={24} className="text-brand-primary" />
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEditSupplier(s.supplier_id)} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDeleteSupplier(s.supplier_id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{s.name} <span className="text-xs font-mono text-gray-500 ml-2">{s.code}</span></h3>
                        <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Company:</span> {s.company_name}</p>
                        <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Type:</span> {s.supplier_type}</p>
                        <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Phone:</span> {s.phone}</p>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default SupplierManagementScreen;
