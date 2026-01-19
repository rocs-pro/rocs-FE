import React from 'react';
import { Plus, Edit, Trash2, Archive } from 'lucide-react';

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
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
                    <p className="text-gray-600 mt-1">Manage your suppliers</p>
                </div>
                <button onClick={() => setIsAddSupplierOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2 hover:bg-brand-secondary transition-colors">
                    <Plus size={20} />
                    Add Supplier
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {suppliers.map((s) => (
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

            {/* Add Supplier Modal */}
            {isAddSupplierOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsAddSupplierOpen(false)}></div>
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 z-10 max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Add Supplier</h2>
                                        <p className="text-gray-600 mt-1">Create a new supplier</p>
                                    </div>
                                    <button onClick={() => setIsAddSupplierOpen(false)} className="text-gray-500 hover:text-gray-700">×</button>
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                                <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Code *</label>
                                            <input value={supplierForm.code} onChange={(e) => setSupplierForm({ ...supplierForm, code: e.target.value })} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="SUP001" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name *</label>
                                            <input value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Supplier name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                            <input value={supplierForm.company_name} onChange={(e) => setSupplierForm({ ...supplierForm, company_name: e.target.value })} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Company name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                                            <input value={supplierForm.contact_person} onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Contact person" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="011-1234567" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="email@example.com" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                            <input value={supplierForm.city} onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Colombo" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Type</label>
                                            <select value={supplierForm.supplier_type} onChange={(e) => setSupplierForm({ ...supplierForm, supplier_type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                                <option value="LOCAL">Local</option>
                                                <option value="INTERNATIONAL">International</option>
                                                <option value="DISTRIBUTOR">Distributor</option>
                                                <option value="MANUFACTURER">Manufacturer</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Category</label>
                                            <select value={supplierForm.supplier_category} onChange={(e) => setSupplierForm({ ...supplierForm, supplier_category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                                <option value="PRIMARY">Primary</option>
                                                <option value="SECONDARY">Secondary</option>
                                                <option value="OCCASIONAL">Occasional</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                                        <button onClick={() => { setIsAddSupplierOpen(false); setSupplierForm({ supplier_id: '', code: '', name: '', company_name: '', contact_person: '', phone: '', mobile: '', email: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'Sri Lanka', supplier_type: 'LOCAL', supplier_category: 'PRIMARY', is_active: true, is_verified: false }); }} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                            Cancel
                                        </button>
                                        <button onClick={() => { if (!supplierForm.code || !supplierForm.name) { alert('Please fill required fields'); return; } setSuppliers([...suppliers, { ...supplierForm, supplier_id: Math.max(...suppliers.map(s => s.supplier_id), 0) + 1 }]); setIsAddSupplierOpen(false); setSupplierForm({ supplier_id: '', code: '', name: '', company_name: '', contact_person: '', phone: '', mobile: '', email: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'Sri Lanka', supplier_type: 'LOCAL', supplier_category: 'PRIMARY', is_active: true, is_verified: false }); }} className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors">
                                            Save Supplier
                                        </button>
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

export default SupplierManagementScreen;
