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
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Item Details - ${item.name}</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                        margin: 20px;
                        padding: 0;
                        background: white;
                        color: #111827;
                    }
                    .container {
                        max-width: 900px;
                        margin: 0 auto;
                    }
                    h1, h2, h3 {
                        margin-top: 20px;
                        margin-bottom: 10px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .info-card {
                        border: 1px solid #d1d5db;
                        padding: 15px;
                        border-radius: 4px;
                    }
                    .info-label {
                        font-size: 12px;
                        color: #6b7280;
                        font-weight: 600;
                        text-transform: uppercase;
                        margin-bottom: 5px;
                    }
                    .info-value {
                        font-size: 16px;
                        font-weight: 600;
                        color: #1f2937;
                        word-break: break-word;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th {
                        background-color: #f3f4f6;
                        border: 1px solid #d1d5db;
                        padding: 10px;
                        text-align: left;
                        font-weight: 600;
                        font-size: 12px;
                    }
                    td {
                        border: 1px solid #d1d5db;
                        padding: 10px;
                    }
                    .quick-stats {
                        display: grid;
                        grid-template-columns: repeat(5, 1fr);
                        gap: 15px;
                        margin-bottom: 30px;
                    }
                    .stat-box {
                        border: 1px solid #d1d5db;
                        padding: 15px;
                        text-align: center;
                        border-radius: 4px;
                    }
                    .stat-label {
                        font-size: 11px;
                        color: #6b7280;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                    .stat-value {
                        font-size: 18px;
                        font-weight: 700;
                        margin-top: 5px;
                    }
                    .section-title {
                        font-size: 14px;
                        font-weight: 700;
                        margin-top: 30px;
                        margin-bottom: 15px;
                        border-bottom: 2px solid #2563eb;
                        padding-bottom: 10px;
                    }
                    .badge {
                        display: inline-block;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: 600;
                    }
                    .badge-active {
                        background-color: #dbeafe;
                        color: #1e40af;
                    }
                    .badge-inactive {
                        background-color: #fee2e2;
                        color: #991b1b;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 10px;
                        }
                        table {
                            page-break-inside: avoid;
                        }
                        tr {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${item.name}</h1>
                    
                    <div class="quick-stats">
                        <div class="stat-box">
                            <div class="stat-label">SKU</div>
                            <div class="stat-value">${item.sku}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Cost Price</div>
                            <div class="stat-value">LKR ${item.cost_price.toFixed(2)}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Selling Price</div>
                            <div class="stat-value">LKR ${item.selling_price.toFixed(2)}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Reorder Level</div>
                            <div class="stat-value">${item.reorder_level}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Status</div>
                            <div class="stat-value">
                                <span class="badge ${item.is_active ? 'badge-active' : 'badge-inactive'}">
                                    ${item.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="section-title">Item Information</div>
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-label">Product ID</div>
                            <div class="info-value">${item.product_id}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Barcode</div>
                            <div class="info-value">${item.barcode}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Category</div>
                            <div class="info-value">${categoryName}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Subcategory</div>
                            <div class="info-value">${subCategoryName}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Brand</div>
                            <div class="info-value">${brandName}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Tax Rate</div>
                            <div class="info-value">${item.tax_rate}%</div>
                        </div>
                    </div>

                    <div class="section-title">Pricing Details</div>
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-label">Cost Price</div>
                            <div class="info-value">LKR ${item.cost_price.toFixed(2)}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Selling Price</div>
                            <div class="info-value">LKR ${item.selling_price.toFixed(2)}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">MRP</div>
                            <div class="info-value">LKR ${item.mrp.toFixed(2)}</div>
                        </div>
                    </div>

                    <div class="section-title">Description</div>
                    <div class="info-card">
                        <div class="info-value">${item.description || 'N/A'}</div>
                    </div>
                </div>
                <script>
                    window.print();
                    window.close();
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
