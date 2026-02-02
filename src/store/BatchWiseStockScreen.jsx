import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { getStatusColor } from '../utils/helpers';
import storeService from '../services/storeService';

const BatchWiseStockScreen = ({
    batches: initialBatches,
    items,
    batchFilterItem,
    setBatchFilterItem
}) => {
    const [batches, setBatches] = useState(initialBatches || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBatches = async () => {
            try {
                const batchData = await storeService.getBatches();
                setBatches(batchData);
            } catch (err) {
                console.error('Error loading batches:', err);
            } finally {
                setLoading(false);
            }
        };
        loadBatches();
    }, []);

    const today = new Date('2026-01-11');
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const filteredBatches = batchFilterItem ? batches.filter(b => b.product_id === parseInt(batchFilterItem)) : batches;

    const getBatchAlert = (expiryDate) => {
        const expiry = new Date(expiryDate);
        if (expiry < today) return 'Expired';
        if (expiry < thirtyDaysLater) return 'Near Expiry';
        return 'Safe';
    };

    const expiredBatches = filteredBatches.filter(b => getBatchAlert(b.expiry_date) === 'Expired').length;
    const nearExpiryBatches = filteredBatches.filter(b => getBatchAlert(b.expiry_date) === 'Near Expiry').length;

    const handleExportReport = () => {
        const csvContent = [
            ['Product Name', 'Batch Code', 'Quantity', 'Expiry Date', 'Manufacturing Date', 'Branch', 'Alert Status'],
            ...filteredBatches.map(b => {
                const product = items.find(i => i.product_id === b.product_id);
                return [
                    product?.name || '',
                    b.batch_code,
                    b.qty,
                    b.expiry_date,
                    b.manufacturing_date,
                    b.branch_id,
                    getBatchAlert(b.expiry_date)
                ];
            })
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'batch-stock-report.csv';
        a.click();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Batch-wise Stock View</h2>
                <p className="text-gray-600 mt-1">Track inventory by batch with expiry monitoring</p>
            </div>

            {/* Alert Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600 font-semibold">Expired Stock</p>
                    <p className="text-2xl font-bold text-red-700 mt-2">{expiredBatches}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-600 font-semibold">Near Expiry</p>
                    <p className="text-2xl font-bold text-yellow-700 mt-2">{nearExpiryBatches}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-semibold">Safe Stock</p>
                    <p className="text-2xl font-bold text-green-700 mt-2">{filteredBatches.filter(b => getBatchAlert(b.expiry_date) === 'Safe').length}</p>
                </div>
            </div>

            {/* Filter and Export */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-end gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Product</label>
                    <select value={batchFilterItem} onChange={(e) => setBatchFilterItem(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">All Products</option>
                        {items.map((item) => <option key={item.product_id} value={item.product_id}>{item.name}</option>)}
                    </select>
                </div>
                <button onClick={handleExportReport} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Batch List Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Batch Code</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Expiry Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Mfg Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cost Price</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Alert</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredBatches.map((batch) => {
                            const alert = getBatchAlert(batch.expiry_date);
                            const product = items.find(i => i.product_id === batch.product_id);
                            return (
                                <tr key={batch.batch_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product?.name}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{batch.batch_code}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{batch.qty}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{batch.expiry_date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{batch.manufacturing_date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">LKR {batch.cost_price?.toFixed(2)}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert)}`}>{alert}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BatchWiseStockScreen;
