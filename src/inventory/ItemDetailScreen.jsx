import React from 'react';
import { Printer } from 'lucide-react';
import { getStatusColor } from '../utils/helpers';

const ItemDetailScreen = ({
    items,
    itemDetails,
    selectedItemId,
    setSelectedItemId,
    setActiveScreen,
    selectedItemTab,
    setSelectedItemTab,
    batches,
    categories,
    brands,
    subCategories
}) => {
    // Use selectedItemId, or default to first item if not set
    const itemId = selectedItemId || items[0]?.product_id;
    const item = items.find(i => i.product_id === itemId);
    const detail = itemDetails[itemId];

    const categoryName = categories?.find(c => c.category_id === item?.category_id)?.name || item?.category_id || 'N/A';
    const subCategoryName = subCategories?.find(s => s.subcategory_id === item?.subcategory_id)?.name || item?.subcategory_id || 'N/A';
    const brandName = brands?.find(b => b.brand_id === item?.brand_id)?.name || item?.brand_id || 'N/A';

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');

        // Helper to generate table rows
        const generateRows = (data, mapFn) => data.map(mapFn).join('');

        // Generate sections based on available data
        const batchRows = batches.filter(b => b.product_id === itemId).map(batch => `
            <tr>
                <td>${batch.batch_code}</td>
                <td style="text-align: center">${batch.qty}</td>
                <td>${batch.manufacturing_date}</td>
                <td>${batch.expiry_date}</td>
                <td>${batch.branch_id}</td>
            </tr>
        `).join('');

        const historyRows = (detail?.stockHistory || []).map(entry => `
            <tr>
                <td>${entry.date}</td>
                <td>${entry.type}</td>
                <td>${entry.reference}</td>
                <td style="text-align: center; color: ${entry.quantity > 0 ? 'green' : 'red'}">${entry.quantity > 0 ? '+' : ''}${entry.quantity}</td>
                <td>${entry.notes}</td>
            </tr>
        `).join('');

        const supplierRows = (detail?.supplierHistory || []).map(supplier => `
            <tr>
                <td>${supplier.name}</td>
                <td>${supplier.lastPO}</td>
                <td>${supplier.leadTime}</td>
                <td style="text-align: right">LKR ${supplier.cost_price.toFixed(2)}</td>
            </tr>
        `).join('');

        const salesRows = (detail?.salesData || []).map(sale => `
            <tr>
                <td>${sale.date}</td>
                <td style="text-align: center">${sale.quantity}</td>
                <td style="text-align: right">LKR ${sale.revenue.toFixed(2)}</td>
            </tr>
        `).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Item Report - ${item.name}</title>
                <style>
                    body { font-family: sans-serif; margin: 20px; color: #111827; }
                    .container { max-width: 900px; margin: 0 auto; }
                    h1 { margin-bottom: 5px; color: #1e3a8a; }
                    .subtitle { color: #6b7280; font-size: 14px; margin-bottom: 20px; }
                    
                    .section { margin-bottom: 30px; page-break-inside: avoid; }
                    .section-title { 
                        font-size: 16px; font-weight: bold; border-bottom: 2px solid #e5e7eb; 
                        padding-bottom: 8px; margin-bottom: 15px; color: #374151;
                    }
                    
                    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; }
                    .label { font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 600; }
                    .value { font-size: 15px; font-weight: 600; margin-top: 2px; }
                    
                    table { width: 100%; border-collapse: collapse; font-size: 13px; }
                    th { background: #f9fafb; padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; }
                    td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
                    
                    .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; }
                    .badge-active { background: #dcfce7; color: #166534; }
                    .badge-inactive { background: #fee2e2; color: #991b1b; }
                    
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h1>${item.name}</h1>
                            <div class="subtitle">SKU: ${item.sku} &bull; Barcode: ${item.barcode}</div>
                        </div>
                        <div style="text-align: right;">
                             <span class="badge ${item.is_active ? 'badge-active' : 'badge-inactive'}">
                                ${item.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                            <div style="margin-top: 5px; font-size: 12px; color: #6b7280;">${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Overview</div>
                        <div class="grid-2">
                            <div class="card">
                                <div class="label">Price Information</div>
                                <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                                    <div>
                                        <div class="label">Cost Price</div>
                                        <div class="value">LKR ${(item.cost_price || 0).toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div class="label">Selling Price</div>
                                        <div class="value">LKR ${(item.selling_price || 0).toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div class="label">MRP</div>
                                        <div class="value">LKR ${(item.mrp || 0).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="label">Stock Information</div>
                                <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                                    <div>
                                        <div class="label">Current Stock</div>
                                        <div class="value" style="font-size: 18px;">${item.quantity || 0}</div>
                                    </div>
                                    <div>
                                        <div class="label">Reorder Level</div>
                                        <div class="value">${item.reorder_level}</div>
                                    </div>
                                    <div>
                                        <div class="label">Category</div>
                                        <div class="value" style="font-size: 13px;">${categoryName}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${batchRows ? `
                    <div class="section">
                        <div class="section-title">Active Batches</div>
                        <table>
                            <thead><tr><th>Batch Code</th><th style="text-align: center">Qty</th><th>Mfg Date</th><th>Expiry Date</th><th>Branch</th></tr></thead>
                            <tbody>${batchRows}</tbody>
                        </table>
                    </div>` : ''}

                    ${historyRows ? `
                    <div class="section">
                        <div class="section-title">Stock History (Last 10 Actions)</div>
                        <table>
                            <thead><tr><th>Date</th><th>Type</th><th>Reference</th><th style="text-align: center">Qty Change</th><th>Notes</th></tr></thead>
                            <tbody>${historyRows}</tbody>
                        </table>
                    </div>` : ''}

                    ${supplierRows ? `
                    <div class="section">
                        <div class="section-title">Supplier Information</div>
                        <table>
                            <thead><tr><th>Supplier</th><th>Last PO</th><th>Lead Time</th><th style="text-align: right">Cost Price</th></tr></thead>
                            <tbody>${supplierRows}</tbody>
                        </table>
                    </div>` : ''}
                    
                    ${salesRows ? `
                    <div class="section">
                        <div class="section-title">Recent Sales</div>
                        <table>
                            <thead><tr><th>Date</th><th style="text-align: center">Qty</th><th style="text-align: right">Revenue</th></tr></thead>
                            <tbody>${salesRows}</tbody>
                        </table>
                    </div>` : ''}

                </div>
                <script>
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 500);
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    if (!item) {
        return (
            <div className="p-6">
                <p className="text-gray-900 font-semibold mb-4">Item not found or no item selected</p>
                <button onClick={() => setActiveScreen('item-list')} className="text-blue-600 hover:text-blue-700">
                    ← Back to List
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={() => { setSelectedItemId(null); setActiveScreen('item-list'); }} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    ← Back to List
                </button>
                <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                <button onClick={handlePrint} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2" title="Print Item Details">
                    <Printer size={20} />
                    <span className="text-sm">Print</span>
                </button>
            </div>



            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                {['summary', 'prices', 'stock-history', 'batches', 'suppliers', 'sales', 'reorder'].map((tab) => (
                    <button key={tab} onClick={() => setSelectedItemTab(tab)} className={`px-4 py-3 font-medium border-b-2 ${selectedItemTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                        {tab === 'summary' && 'Summary'}
                        {tab === 'prices' && 'Prices'}
                        {tab === 'stock-history' && 'Stock History'}
                        {tab === 'batches' && 'Batch & Expiry'}
                        {tab === 'suppliers' && 'Suppliers'}
                        {tab === 'sales' && 'Sales'}
                        {tab === 'reorder' && 'Reorder Alerts'}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {selectedItemTab === 'summary' && (
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Information</h3>
                        <div className="space-y-3">
                            <div><label className="text-sm text-gray-600">Product ID:</label><p className="font-mono">{item.product_id}</p></div>
                            <div><label className="text-sm text-gray-600">Barcode:</label><p className="font-mono">{item.barcode}</p></div>
                            <div><label className="text-sm text-gray-600">SKU:</label><p className="font-mono">{item.sku}</p></div>
                            <div><label className="text-sm text-gray-600">Category:</label><p>{categoryName}</p></div>
                            <div><label className="text-sm text-gray-600">Subcategory:</label><p>{subCategoryName}</p></div>
                            <div><label className="text-sm text-gray-600">Brand:</label><p>{brandName}</p></div>
                            <div><label className="text-sm text-gray-600">Description:</label><p>{item.description}</p></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Details</h3>
                        <div className="space-y-3">
                            <div><label className="text-sm text-gray-600">Cost Price:</label><p className="text-lg font-bold">LKR {item.cost_price.toFixed(2)}</p></div>
                            <div><label className="text-sm text-gray-600">Selling Price:</label><p className="text-lg font-bold">LKR {item.selling_price.toFixed(2)}</p></div>
                            <div><label className="text-sm text-gray-600">MRP:</label><p className="text-lg font-bold">LKR {item.mrp.toFixed(2)}</p></div>
                            <div><label className="text-sm text-gray-600">Tax Rate:</label><p className="text-lg font-bold">{item.tax_rate}%</p></div>
                            <div><label className="text-sm text-gray-600">Reorder Level:</label><p className="text-lg font-bold">{item.reorder_level} units</p></div>
                            <div><label className="text-sm text-gray-600">Status:</label><p><span className={`px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.is_active ? 'Active' : 'Inactive'}</span></p></div>
                        </div>
                    </div>
                </div>
            )}

            {selectedItemTab === 'prices' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Price</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Change</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {(detail?.priceHistory || []).map((entry, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{entry.date}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-right">LKR {entry.selling_price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${entry.change.includes('+') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{entry.change}</span></td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{entry.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedItemTab === 'stock-history' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reference</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {(detail?.stockHistory || []).map((entry, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{entry.date}</td>
                                    <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 text-xs font-medium rounded-full ${entry.type === 'GRN' ? 'bg-green-100 text-green-700' : entry.type === 'Sales' ? 'bg-blue-100 text-blue-700' : entry.type === 'Adjustment' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{entry.type}</span></td>
                                    <td className="px-6 py-4 text-sm font-mono">{entry.reference}</td>
                                    <td className="px-6 py-4 text-center text-sm font-mono"><span className={entry.quantity > 0 ? 'text-green-600' : 'text-red-600'}>{entry.quantity > 0 ? '+' : ''}{entry.quantity}</span></td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{entry.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedItemTab === 'batches' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Batch Code</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Mfg Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cost Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {batches.filter(b => b.product_id === itemId).map((batch) => (
                                <tr key={batch.batch_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-mono">{batch.batch_code}</td>
                                    <td className="px-6 py-4 text-center text-sm">{batch.qty}</td>
                                    <td className="px-6 py-4 text-sm">{batch.manufacturing_date}</td>
                                    <td className="px-6 py-4 text-sm">{batch.expiry_date}</td>
                                    <td className="px-6 py-4 text-sm">{batch.branch_id}</td>
                                    <td className="px-6 py-4 text-sm font-mono">LKR {batch.cost_price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedItemTab === 'suppliers' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Supplier</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last PO</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Delivery</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lead Time</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Cost Price</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Reliability</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {(detail?.supplierHistory || []).map((supplier, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium">{supplier.name}</td>
                                    <td className="px-6 py-4 text-sm font-mono">{supplier.lastPO}</td>
                                    <td className="px-6 py-4 text-sm">{supplier.lastDelivery}</td>
                                    <td className="px-6 py-4 text-sm">{supplier.leadTime}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-right">LKR {supplier.cost_price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center text-sm"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">{supplier.reliability}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedItemTab === 'sales' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Quantity Sold</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {detail?.salesData && detail.salesData.length > 0 ? (
                                detail.salesData.map((sale, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm">{sale.date}</td>
                                        <td className="px-6 py-4 text-center text-sm font-mono">{sale.quantity}</td>
                                        <td className="px-6 py-4 text-right text-sm font-mono text-green-600">LKR {sale.revenue.toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No sales data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedItemTab === 'reorder' && (
                <div className="space-y-4">
                    <div className={`${item.reorder_level > 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'} border rounded-lg p-6`}>
                        <p className={`text-sm ${item.reorder_level > 0 ? 'text-orange-600' : 'text-green-600'} font-semibold`}>{item.reorder_level > 0 ? 'MONITOR STOCK' : 'IN STOCK'}</p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-sm text-gray-600">Reorder Level</p>
                                <p className="text-2xl font-bold mt-1">{item.reorder_level}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Minimum Order Qty</p>
                                <p className="text-2xl font-bold mt-1">-</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetailScreen;
