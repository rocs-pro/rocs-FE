import React, { useState, useEffect } from 'react';
import storeService from '../services/storeService';

const StockTransferCreateScreen = ({
    transferForm,
    setTransferForm,
    transfers: initialTransfers,
    setTransfers,
    branches,
    items,
    batches
}) => {
    const [transfers, setLocalTransfers] = useState(initialTransfers || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadTransfers = async () => {
            try {
                const transferData = await storeService.getTransfers();
                setLocalTransfers(transferData);
                if (setTransfers) setTransfers(transferData);
            } catch (err) {
                console.error('Error loading transfers:', err);
            }
        };
        loadTransfers();
    }, []);

    const handleCreateTransfer = async (submit = false) => {
        if (transferForm.fromBranch && transferForm.toBranch && transferForm.product_id && transferForm.quantity) {
            setLoading(true);
            try {
                const item = items.find(i => i.product_id === parseInt(transferForm.product_id));
                const batch = batches.find(b => b.batch_id === parseInt(transferForm.batch_id));

                const payload = {
                    from_branch: transferForm.fromBranch,
                    to_branch: transferForm.toBranch,
                    product_id: parseInt(transferForm.product_id),
                    batch_id: transferForm.batch_id ? parseInt(transferForm.batch_id) : null,
                    quantity: parseInt(transferForm.quantity),
                    transfer_date: transferForm.transferDate || new Date().toISOString().split('T')[0],
                    remarks: transferForm.remarks,
                    transfer_status: submit ? 'PENDING' : 'DRAFT'
                };

                const createdTransfer = await storeService.createTransfer(payload);

                const newTransfer = {
                    ...createdTransfer,
                    product_name: item?.name || '',
                    batch_code: batch?.batch_code || '',
                    requestedBy: 'Current User'
                };

                const updatedTransfers = [...transfers, newTransfer];
                setLocalTransfers(updatedTransfers);
                if (setTransfers) setTransfers(updatedTransfers);

                setTransferForm({ fromBranch: '', toBranch: '', product_id: '', quantity: '', batch_id: '', transferDate: '', remarks: '', status: 'Draft' });

                if (submit) {
                    alert('Transfer submitted for approval');
                }
            } catch (err) {
                console.error('Error creating transfer:', err);
                alert('Failed to create transfer');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 drop-shadow-sm">Create Stock Transfer</h2>
                <p className="text-gray-600 mt-1">Transfer stock between warehouses</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">New Transfer</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Branch</label>
                        <select value={transferForm.fromBranch} onChange={(e) => setTransferForm({ ...transferForm, fromBranch: e.target.value })} className="w-full">
                            <option value="">Select Source</option>
                            {branches.map((b) => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">To Branch</label>
                        <select value={transferForm.toBranch} onChange={(e) => setTransferForm({ ...transferForm, toBranch: e.target.value })} className="w-full">
                            <option value="">Select Destination</option>
                            {branches.filter(b => b.branch_id !== parseInt(transferForm.fromBranch)).map((b) => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                        <select value={transferForm.product_id} onChange={(e) => setTransferForm({ ...transferForm, product_id: e.target.value })} className="w-full">
                            <option value="">Select Product</option>
                            {items.map((item) => <option key={item.product_id} value={item.product_id}>{item.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                        <select value={transferForm.batch_id} onChange={(e) => setTransferForm({ ...transferForm, batch_id: e.target.value })} className="w-full">
                            <option value="">Select Batch</option>
                            {batches.filter(b => !transferForm.product_id || b.product_id === parseInt(transferForm.product_id)).map((batch) => <option key={batch.batch_id} value={batch.batch_id}>{batch.batch_code}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input value={transferForm.quantity} onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })} type="number" placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Date</label>
                        <input value={transferForm.transferDate} onChange={(e) => setTransferForm({ ...transferForm, transferDate: e.target.value })} type="date" className="w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                        <input value={transferForm.remarks} onChange={(e) => setTransferForm({ ...transferForm, remarks: e.target.value })} type="text" placeholder="Enter remarks" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleCreateTransfer(false)} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Saving...' : 'Save as Draft'}</button>
                    <button onClick={() => handleCreateTransfer(true)} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Submitting...' : 'Submit'}</button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">From</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">To</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Batch</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transfers.map((tr) => (
                            <tr key={tr.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-600">{tr.fromBranch}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{tr.toBranch}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{tr.product_name}</td>
                                <td className="px-6 py-4 text-center text-sm font-mono">{tr.quantity}</td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">{tr.batch_code}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{tr.date}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${tr.status === 'Draft' ? 'bg-gray-100 text-gray-700' : tr.status === 'Submitted' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{tr.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockTransferCreateScreen;
