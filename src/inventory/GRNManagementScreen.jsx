import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, CheckCircle, Clock, Save, Trash2, ArrowLeft } from 'lucide-react';
import inventoryService from '../services/inventoryService';
import { useInventoryNotification } from './context/InventoryNotificationContext';

const GRNManagementScreen = ({ items, suppliers, branches, categories = [], subCategories = [] }) => {
    const { success, error, warning } = useInventoryNotification();
    const [view, setView] = useState('list'); // 'list', 'create', 'detail'
    const [grns, setGrns] = useState([]);
    const [selectedGRN, setSelectedGRN] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Create Form State
    const [formData, setFormData] = useState({
        supplier_id: '',
        grn_date: new Date().toISOString().split('T')[0],
        invoice_no: '',
        invoice_date: new Date().toISOString().split('T')[0],
        notes: '',
        branch_id: branches?.[0]?.branch_id || 1, // Default to first branch or 1
        items: []
    });

    const [currentItem, setCurrentItem] = useState({
        product_id: '',
        quantity: '',
        unit_price: '',
        batch_code: '',
        expiry_date: '',
        imei: ''
    });

    // Subcategory Filter State
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');

    // Derived lists
    const filteredSubCategories = selectedCategoryId
        ? subCategories.filter(sc => sc.category_id === parseInt(selectedCategoryId))
        : [];

    const productOptions = items.filter(item => {
        if (selectedCategoryId && item.category_id !== parseInt(selectedCategoryId)) return false;
        if (selectedSubCategoryId && item.subcategory_id !== parseInt(selectedSubCategoryId)) return false;
        return true;
    });

    // Fetch GRNs
    useEffect(() => {
        const fetchGRNs = async () => {
            setLoading(true);
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const branchId = user.branchId || branches?.[0]?.branch_id || 1;
                const data = await inventoryService.getGRNs(branchId);
                setGrns(data || []);
            } catch (error) {
                console.error("Failed to fetch GRNs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGRNs();
    }, [branches]);

    const filteredGRNs = grns.filter(grn =>
        grn.grn_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grn.invoice_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suppliers.find(s => s.supplier_id === grn.supplier_id)?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddItem = () => {
        if (!currentItem.product_id || !currentItem.quantity || !currentItem.unit_price) {
            warning('Please fill in Product, Quantity and Unit Price');
            return;
        }

        const product = items.find(i => i.product_id === parseInt(currentItem.product_id));
        const newItem = {
            ...currentItem,
            product_name: product?.name || 'Unknown',
            subtotal: parseFloat(currentItem.quantity) * parseFloat(currentItem.unit_price)
        };

        setFormData({
            ...formData,
            items: [...formData.items, newItem]
        });

        // Reset current item input
        setCurrentItem({
            product_id: '',
            quantity: '',
            unit_price: '',
            batch_code: '',
            expiry_date: '',
            imei: ''
        });
    };

    const handleRemoveItem = (index) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            const newItems = [...formData.items];
            newItems.splice(index, 1);
            setFormData({ ...formData, items: newItems });
        }
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const handleSubmit = async () => {
        if (!formData.supplier_id) {
            warning('Please select a supplier');
            return;
        }
        if (formData.items.length === 0) {
            warning('Please add at least one item');
            return;
        }

        try {
            const grnPayload = {
                ...formData,
                total_amount: calculateTotal(),
                net_amount: calculateTotal(),
                status: 'PENDING'
            };

            const createdGRN = await inventoryService.createGRN(grnPayload);
            success(`GRN Created Successfully! GRN No: ${createdGRN.grn_no || 'N/A'}`);
            setView('list');

            // Refresh list
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const branchId = user.branchId || branches?.[0]?.branch_id || 1;
            const data = await inventoryService.getGRNs(branchId);
            setGrns(data || []);

            // Reset form
            setFormData({
                supplier_id: '',
                grn_date: new Date().toISOString().split('T')[0],
                invoice_no: '',
                invoice_date: new Date().toISOString().split('T')[0],
                notes: '',
                branch_id: branches?.[0]?.branch_id || 1,
                items: []
            });
        } catch (error) {
            console.error("Error creating GRN:", error);
            error('Failed to create GRN: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleApproveGRN = async (grnId) => {
        if (!window.confirm('Are you sure you want to approve this GRN? This will update stock levels.')) {
            return;
        }

        try {
            await inventoryService.approveGRN(grnId);
            success('GRN approved successfully!');

            // Refresh list
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const branchId = user.branchId || branches?.[0]?.branch_id || 1;
            const data = await inventoryService.getGRNs(branchId);
            setGrns(data || []);

            if (selectedGRN && selectedGRN.grn_id === grnId) {
                const updated = await inventoryService.getGRNById(grnId);
                setSelectedGRN(updated);
            }
        } catch (error) {
            console.error('Error approving GRN:', error);
            error('Failed to approve GRN: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRejectGRN = async (grnId) => {
        const reason = prompt('Please enter rejection reason:');
        if (!reason) return;

        try {
            await inventoryService.rejectGRN(grnId, reason);
            success('GRN rejected successfully!');

            // Refresh list
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const branchId = user.branchId || branches?.[0]?.branch_id || 1;
            const data = await inventoryService.getGRNs(branchId);
            setGrns(data || []);

            if (selectedGRN && selectedGRN.grn_id === grnId) {
                setView('list');
                setSelectedGRN(null);
            }
        } catch (error) {
            console.error('Error rejecting GRN:', error);
            error('Failed to reject GRN: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleViewGRN = async (grn) => {
        try {
            const fullGRN = await inventoryService.getGRNById(grn.grn_id);
            setSelectedGRN(fullGRN);
            setView('detail');
        } catch (error) {
            console.error('Error fetching GRN details:', error);
            error('Failed to fetch GRN details');
        }
    };

    if (view === 'detail' && selectedGRN) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => { setView('list'); setSelectedGRN(null); }} className="p-2 hover:bg-gray-100 rounded-full">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 drop-shadow-sm">
                                GRN Details - {selectedGRN.grn_no}
                            </h2>
                            <p className="text-gray-600 text-sm">View and manage GRN</p>
                        </div>
                    </div>
                    {selectedGRN.status === 'PENDING' && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleApproveGRN(selectedGRN.grn_id)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <CheckCircle size={20} /> Approve
                            </button>
                            <button
                                onClick={() => handleRejectGRN(selectedGRN.grn_id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">GRN Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">GRN No</label>
                                    <p className="text-base font-mono font-medium">{selectedGRN.grn_no}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Status</label>
                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${selectedGRN.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            selectedGRN.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                selectedGRN.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                        }`}>
                                        {selectedGRN.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Supplier</label>
                                    <p className="text-base">{selectedGRN.supplier_name || suppliers.find(s => s.supplier_id === selectedGRN.supplier_id)?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">GRN Date</label>
                                    <p className="text-base">{selectedGRN.grn_date}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Invoice No</label>
                                    <p className="text-base font-mono">{selectedGRN.invoice_no}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Invoice Date</label>
                                    <p className="text-base">{selectedGRN.invoice_date}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Payment Status</label>
                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${selectedGRN.payment_status === 'PAID' ? 'bg-green-100 text-green-700' :
                                            selectedGRN.payment_status === 'PARTIALLY_PAID' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {selectedGRN.payment_status || 'UNPAID'}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Created At</label>
                                    <p className="text-base text-sm">{selectedGRN.created_at ? new Date(selectedGRN.created_at).toLocaleString() : 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">Items</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Product</th>
                                            <th className="px-4 py-2 text-left">Batch</th>
                                            <th className="px-4 py-2 text-left">Expiry</th>
                                            <th className="px-4 py-2 text-right">Qty</th>
                                            <th className="px-4 py-2 text-right">Unit Price</th>
                                            <th className="px-4 py-2 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedGRN.items?.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2">
                                                    {item.product_name || items.find(i => i.product_id === item.product_id)?.name || `Product #${item.product_id}`}
                                                </td>
                                                <td className="px-4 py-2 text-gray-500">{item.batch_code || '-'}</td>
                                                <td className="px-4 py-2 text-gray-500">{item.expiry_date || '-'}</td>
                                                <td className="px-4 py-2 text-right">{item.qty_received || item.quantity}</td>
                                                <td className="px-4 py-2 text-right font-mono">{parseFloat(item.unit_price).toFixed(2)}</td>
                                                <td className="px-4 py-2 text-right font-mono font-medium">{parseFloat(item.total || (item.qty_received || item.quantity) * item.unit_price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">Summary</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Items</span>
                                    <span className="font-medium">{selectedGRN.items?.length || 0}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total Amount</span>
                                    <span>LKR {(selectedGRN.total_amount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Net Amount</span>
                                    <span className="font-medium">LKR {(selectedGRN.net_amount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'create') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 drop-shadow-sm">Create New GRN</h2>
                            <p className="text-gray-600 text-sm">Receive stock from suppliers</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">Supplier & Invoice Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                    <select
                                        className="w-full"
                                        value={formData.supplier_id}
                                        onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                                    >
                                        <option value="">Select Supplier</option>
                                        {suppliers.map(s => (
                                            <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                    <select
                                        className="w-full"
                                        value={formData.branch_id}
                                        onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                                    >
                                        {branches?.map(b => (
                                            <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
                                        )) || <option value="1">Main Branch</option>}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-2.5"
                                        value={formData.invoice_no}
                                        onChange={(e) => setFormData({ ...formData, invoice_no: e.target.value })}
                                        placeholder="Enter Invoice Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                                    <input
                                        type="date"
                                        className="w-full"
                                        value={formData.invoice_date}
                                        onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Received Date</label>
                                    <input
                                        type="date"
                                        className="w-full"
                                        value={formData.grn_date}
                                        onChange={(e) => setFormData({ ...formData, grn_date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">Add Items</h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end mb-4">
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full text-sm"
                                        value={selectedCategoryId}
                                        onChange={(e) => {
                                            setSelectedCategoryId(e.target.value);
                                            setSelectedSubCategoryId(''); // Reset subcat
                                        }}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(c => (
                                            <option key={c.category_id} value={c.category_id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Subcategory</label>
                                    <select
                                        className="w-full text-sm"
                                        value={selectedSubCategoryId}
                                        onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                                        disabled={!selectedCategoryId}
                                    >
                                        <option value="">All Subcategories</option>
                                        {filteredSubCategories.map(sc => (
                                            <option key={sc.subcategory_id} value={sc.subcategory_id}>{sc.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-6">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
                                    <select
                                        className="w-full text-sm"
                                        value={currentItem.product_id}
                                        onChange={(e) => {
                                            const prod = items.find(i => i.product_id === parseInt(e.target.value));
                                            setCurrentItem({
                                                ...currentItem,
                                                product_id: e.target.value,
                                                unit_price: prod ? prod.cost_price : ''
                                            });
                                        }}
                                    >
                                        <option value="">Select Product</option>
                                        {productOptions.map(i => (
                                            <option key={i.product_id} value={i.product_id}>{i.name} ({i.sku})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Batch Code</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        value={currentItem.batch_code}
                                        onChange={(e) => setCurrentItem({ ...currentItem, batch_code: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="w-full text-sm"
                                        value={currentItem.expiry_date}
                                        onChange={(e) => setCurrentItem({ ...currentItem, expiry_date: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">IMEI / Serial</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        value={currentItem.imei}
                                        onChange={(e) => setCurrentItem({ ...currentItem, imei: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Qty</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        value={currentItem.quantity}
                                        onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Cost</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        value={currentItem.unit_price}
                                        onChange={(e) => setCurrentItem({ ...currentItem, unit_price: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-12 flex justify-end">
                                    <button
                                        onClick={handleAddItem}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Item
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Product</th>
                                            <th className="px-4 py-2 text-left">Batch</th>
                                            <th className="px-4 py-2 text-left">Expiry</th>
                                            <th className="px-4 py-2 text-left">IMEI</th>
                                            <th className="px-4 py-2 text-right">Qty</th>
                                            <th className="px-4 py-2 text-right">Cost</th>
                                            <th className="px-4 py-2 text-right">Total</th>
                                            <th className="px-4 py-2 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {formData.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2">{item.product_name}</td>
                                                <td className="px-4 py-2 text-gray-500">{item.batch_code || '-'}</td>
                                                <td className="px-4 py-2 text-gray-500">{item.expiry_date || '-'}</td>
                                                <td className="px-4 py-2 text-gray-500">{item.imei || '-'}</td>
                                                <td className="px-4 py-2 text-right">{item.quantity}</td>
                                                <td className="px-4 py-2 text-right">{parseFloat(item.unit_price).toFixed(2)}</td>
                                                <td className="px-4 py-2 text-right font-medium">{item.subtotal.toFixed(2)}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        onClick={() => handleRemoveItem(idx)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {formData.items.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">No items added yet</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-lg font-semibold mb-4">Summary</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Items</span>
                                    <span className="font-medium">{formData.items.length}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total Amount</span>
                                    <span>LKR {calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-secondary flex items-center justify-center gap-2"
                                >
                                    <Save size={20} /> Save GRN
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 drop-shadow-sm">Goods Received Note (GRN)</h2>
                    <p className="text-gray-600 mt-1">Manage inbound stock</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setView('create')}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
                    >
                        <Plus size={20} /> Create GRN
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">GRN No</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Supplier</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Invoice</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredGRNs.length > 0 ? (
                            filteredGRNs.map((grn) => (
                                <tr
                                    key={grn.grn_id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => handleViewGRN(grn)}
                                >
                                    <td className="px-6 py-4 text-sm font-mono font-medium text-brand-primary">{grn.grn_no}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{grn.supplier_name || suppliers.find(s => s.supplier_id === grn.supplier_id)?.name || grn.supplier_id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{grn.invoice_no}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{grn.grn_date}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-right font-medium">LKR {(grn.total_amount || 0).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${grn.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                grn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    grn.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {grn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <FileText size={48} className="text-gray-300 mb-4" />
                                        <p className="text-lg font-medium text-gray-900">No GRNs Found</p>
                                        <p className="text-sm text-gray-500 mt-1">Create a new GRN to get started</p>
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

export default GRNManagementScreen;
