import React, { useState } from 'react';
import { Plus, Search, Filter, Download, FileText, Edit, Printer, Trash2, X } from 'lucide-react';
import { getStatusColor } from '../utils/helpers';

const ItemListScreen = ({
    items,
    searchQuery,
    setSearchQuery,
    setIsAddModalOpen,
    setSelectedItemId,
    setActiveScreen,
    handleDeleteItem,
    handleEditItem,
    categories
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        stockStatus: '',
        status: ''
    });

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.barcode.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = filters.category ? item.category_id === filters.category : true;

        let matchesStock = true;
        if (filters.stockStatus === 'low') matchesStock = (item.quantity || 0) <= (item.reorder_level || 0);
        else if (filters.stockStatus === 'out') matchesStock = (item.quantity || 0) <= 0;
        else if (filters.stockStatus === 'in') matchesStock = (item.quantity || 0) > 0;

        const matchesStatus = filters.status === 'active' ? item.is_active :
            filters.status === 'inactive' ? !item.is_active : true;

        return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    });

    const clearFilters = () => {
        setFilters({
            category: '',
            stockStatus: '',
            status: ''
        });
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Item List</h2>
                    <p className="text-gray-600 mt-1">Manage your inventory items</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2 hover:bg-brand-secondary transition-colors btn-hover-scale btn-interactive">
                    <Plus size={20} />
                    Add New Item
                </button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search items by name, code, or barcode..."
                        className="w-full pl-10 pr-4 py-2.5 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${showFilters || activeFilterCount > 0 ? 'border-brand-primary bg-blue-50 text-brand-primary' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                        <Filter size={20} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="flex items-center justify-center bg-brand-primary text-white text-xs font-bold rounded-full w-5 h-5">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {showFilters && (
                        <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Filter Items</h3>
                                {activeFilterCount > 0 && (
                                    <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 font-medium">
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                                    >
                                        <option value="">All Categories</option>
                                        {categories?.map(cat => (
                                            <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Stock Status</label>
                                    <select
                                        value={filters.stockStatus}
                                        onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                                    >
                                        <option value="">All Stock Levels</option>
                                        <option value="in">In Stock</option>
                                        <option value="low">Low Stock</option>
                                        <option value="out">Out of Stock</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Item Status</label>
                                    <div className="flex rounded-lg border border-gray-200 p-1">
                                        <button
                                            onClick={() => setFilters({ ...filters, status: '' })}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded ${!filters.status ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setFilters({ ...filters, status: 'active' })}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded ${filters.status === 'active' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            Active
                                        </button>
                                        <button
                                            onClick={() => setFilters({ ...filters, status: 'inactive' })}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded ${filters.status === 'inactive' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            Inactive
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => {
                        const headers = ['📌 SKU', '📦 Item Name', '🏷️ Category', '📊 Quantity', '💲 Selling Price', '💰 MRP', '📉 Reorder Level', '🔢 Tax Rate', '🟢 Status'];
                        const csvContent = [
                            headers.join(','),
                            ...filteredItems.map(item => {
                                const isLowStock = (item.quantity || 0) <= (item.reorder_level || 0);
                                const quantityWithEmoji = isLowStock ? `⚠️ ${item.quantity || 0}` : `✅ ${item.quantity || 0}`;
                                const statusWithEmoji = item.is_active ? '✅ Active' : '❌ Inactive';

                                return [
                                    item.sku,
                                    `"${item.name.replace(/"/g, '""')}"`, // Handle commas in name
                                    `"${(categories?.find(c => c.category_id === item.category_id)?.name || item.category_id || '').replace(/"/g, '""')}"`,
                                    quantityWithEmoji,
                                    item.selling_price.toFixed(2),
                                    item.mrp.toFixed(2),
                                    item.reorder_level,
                                    `${item.tax_rate}%`,
                                    statusWithEmoji
                                ].join(',');
                            })
                        ].join('\n');

                        // Add BOM for Excel UTF-8 compatibility
                        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        if (link.download !== undefined) {
                            const url = URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('download', `item_list_${new Date().toISOString().split('T')[0]}.csv`);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
                >
                    <Download size={20} />
                    Export
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Selling Price</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">MRP</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reorder Level</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tax Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredItems.map((item) => (
                            <tr key={item.product_id} onClick={() => { setSelectedItemId(item.product_id); setActiveScreen('item-detail'); }} className="hover:bg-gray-50 cursor-pointer">
                                <td className="px-6 py-4 text-sm font-mono text-gray-900">{item.sku}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{categories?.find(c => c.category_id === item.category_id)?.name || item.category_id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.quantity || 0}</td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-900">LKR {item.selling_price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-900">LKR {item.mrp.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.reorder_level}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.tax_rate}%</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-medium rounded ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.product_id); setActiveScreen('item-detail'); }} className="p-1.5 text-brand-primary hover:bg-blue-50 rounded transition-colors bg-blue-50/50" title="View Details">
                                            <FileText size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleEditItem(item.product_id); }} className="p-1.5 text-brand-primary hover:bg-blue-50 rounded transition-colors bg-blue-50/50" title="Edit Item">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setActiveScreen('barcode-print'); }} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors" title="Print Barcode">
                                            <Printer size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.product_id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default ItemListScreen;
