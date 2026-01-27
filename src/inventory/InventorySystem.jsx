import React, { useState } from 'react';
import {
    Package, Plus, Search, Filter, Edit, Trash2, Printer,
    BarChart3, Tag, Box, Calendar, AlertTriangle, ArrowRightLeft,
    CheckCircle, FileText, TrendingUp, Clock, ChevronRight,
    Download, Upload, RefreshCw, Archive, X
} from 'lucide-react';

import ItemListScreen from './ItemListScreen';
import AddItemScreen from './AddItemScreen';
import ItemDetailScreen from './ItemDetailScreen';
import CategoryManagementScreen from './CategoryManagementScreen';
import BrandManagementScreen from './BrandManagementScreen';
import SupplierManagementScreen from './SupplierManagementScreen';

import StockOverviewScreen from '../dashboard/StockOverviewScreen';

import BatchWiseStockScreen from '../store/BatchWiseStockScreen';
import ExpiryCalendarScreen from '../store/ExpiryCalendarScreen';
import StockAdjustmentScreen from '../store/StockAdjustmentScreen';
import DamageEntryScreen from '../store/DamageEntryScreen';
import StockTransferCreateScreen from '../store/StockTransferCreateScreen';
import TransferApprovalScreen from '../store/TransferApprovalScreen';

import StockValuationScreen from '../reports/StockValuationScreen';
import StockAgingScreen from '../reports/StockAgingScreen';

const InventorySystem = () => {
    const [activeScreen, setActiveScreen] = useState('item-list');
    const [currentTime, setCurrentTime] = useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
    const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Edit states
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingType, setEditingType] = useState(null); // 'category', 'brand', 'supplier', 'item'

    const [suppliers, setSuppliers] = useState([
        { supplier_id: 1, code: 'SUP001', name: 'Coca Cola Distributors', company_name: 'Coca Cola Lanka', contact_person: 'John Smith', phone: '011-1234567', mobile: '0771234567', email: 'sales@cocacola.lk', address_line1: '123 Main St', city: 'Colombo', country: 'Sri Lanka', supplier_type: 'DISTRIBUTOR', supplier_category: 'PRIMARY', is_active: true, is_verified: true },
        { supplier_id: 2, code: 'SUP002', name: 'PepsiCo Lanka', company_name: 'PepsiCo Distribution', contact_person: 'Jane Doe', phone: '011-2345678', mobile: '0772345678', email: 'info@pepsico.lk', address_line1: '456 Oak Ave', city: 'Colombo', country: 'Sri Lanka', supplier_type: 'DISTRIBUTOR', supplier_category: 'PRIMARY', is_active: true, is_verified: true },
        { supplier_id: 3, code: 'SUP003', name: 'Anchor Foods', company_name: 'Anchor Dairy Products', contact_person: 'Mike Johnson', phone: '011-3456789', mobile: '0773456789', email: 'contact@anchor.lk', address_line1: '789 Dairy Ln', city: 'Colombo', country: 'Sri Lanka', supplier_type: 'MANUFACTURER', supplier_category: 'PRIMARY', is_active: true, is_verified: true },
        { supplier_id: 4, code: 'SUP004', name: 'Sunrice Suppliers', company_name: 'Sunrice Agricultural Ltd', contact_person: 'Sarah Wilson', phone: '011-4567890', mobile: '0774567890', email: 'sales@sunrice.lk', address_line1: '321 Rice Farm Rd', city: 'Colombo', country: 'Sri Lanka', supplier_type: 'DISTRIBUTOR', supplier_category: 'PRIMARY', is_active: true, is_verified: true },
    ]);
    const [supplierForm, setSupplierForm] = useState({ supplier_id: '', code: '', name: '', company_name: '', contact_person: '', phone: '', mobile: '', email: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'Sri Lanka', supplier_type: 'LOCAL', supplier_category: 'PRIMARY', is_active: true, is_verified: false });

    const [brands, setBrands] = useState([
        { brand_id: 1, name: 'Coca Cola', description: 'Popular beverage brand', is_active: true, created_at: '2025-01-01' },
        { brand_id: 2, name: 'Lays', description: 'Snack brand', is_active: true, created_at: '2025-01-01' },
    ]);
    const [brandForm, setBrandForm] = useState({ brand_id: '', name: '', description: '', is_active: true });

    const [categories, setCategories] = useState([
        { category_id: 1, name: 'Beverages', description: 'Drinks and beverages', is_active: true, created_at: '2025-01-01' },
        { category_id: 2, name: 'Snacks', description: 'Snack items', is_active: true, created_at: '2025-01-01' },
        { category_id: 3, name: 'Dairy', description: 'Dairy products', is_active: true, created_at: '2025-01-01' },
        { category_id: 4, name: 'Grains', description: 'Rice and grain products', is_active: true, created_at: '2025-01-01' },
    ]);
    const [categoryForm, setCategoryForm] = useState({ category_id: '', name: '', description: '', is_active: true });
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

    const handleAddCategory = () => {
        if (categoryForm.name.trim()) {
            const newCategory = {
                category_id: Math.max(...categories.map(c => c.category_id), 0) + 1,
                name: categoryForm.name,
                description: categoryForm.description,
                is_active: categoryForm.is_active,
                created_at: new Date().toISOString().split('T')[0]
            };
            setCategories([...categories, newCategory]);
            setCategoryForm({ category_id: '', name: '', description: '', is_active: true });
            setIsAddCategoryOpen(false);
        }
    };

    const handleDeleteCategory = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(c => c.category_id !== categoryId));
        }
    };

    const handleDeleteBrand = (brandId) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            setBrands(brands.filter(b => b.brand_id !== brandId));
        }
    };

    const handleDeleteSupplier = (supplierId) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            setSuppliers(suppliers.filter(s => s.supplier_id !== supplierId));
        }
    };

    const handleDeleteItem = (productId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setItems(items.filter(i => i.product_id !== productId));
        }
    };

    const handleEditCategory = (categoryId) => {
        const category = categories.find(c => c.category_id === categoryId);
        if (category) {
            setCategoryForm({ ...category });
            setEditingId(categoryId);
            setEditingType('category');
            setIsEditMode(true);
            setIsAddCategoryOpen(true);
        }
    };

    const handleEditBrand = (brandId) => {
        const brand = brands.find(b => b.brand_id === brandId);
        if (brand) {
            setBrandForm({ ...brand });
            setEditingId(brandId);
            setEditingType('brand');
            setIsEditMode(true);
            setIsAddBrandOpen(true);
        }
    };

    const handleEditSupplier = (supplierId) => {
        const supplier = suppliers.find(s => s.supplier_id === supplierId);
        if (supplier) {
            setSupplierForm({ ...supplier });
            setEditingId(supplierId);
            setEditingType('supplier');
            setIsEditMode(true);
            setIsAddSupplierOpen(true);
        }
    };

    const handleSaveEdit = () => {
        if (editingType === 'category' && categoryForm.name.trim()) {
            setCategories(categories.map(c => c.category_id === editingId ? categoryForm : c));
            setIsEditMode(false);
            setEditingId(null);
            setEditingType(null);
            setIsAddCategoryOpen(false);
        } else if (editingType === 'brand' && brandForm.name.trim()) {
            setBrands(brands.map(b => b.brand_id === editingId ? brandForm : b));
            setIsEditMode(false);
            setEditingId(null);
            setEditingType(null);
            setIsAddBrandOpen(false);
        } else if (editingType === 'supplier' && supplierForm.name.trim()) {
            setSuppliers(suppliers.map(s => s.supplier_id === editingId ? supplierForm : s));
            setIsEditMode(false);
            setEditingId(null);
            setEditingType(null);
            setIsAddSupplierOpen(false);
        }
    };

    const [stockFilterCategory, setStockFilterCategory] = useState('');
    const [stockFilterWarehouse, setStockFilterWarehouse] = useState('');
    const [stockFilterDate, setStockFilterDate] = useState('');

    const branches = [
        { branch_id: 1, code: 'BRN001', name: 'Main Warehouse', address: '123 Main St, Colombo', phone: '011-1111111', is_active: true },
        { branch_id: 2, code: 'BRN002', name: 'Store A', address: '456 Oak Ave, Colombo', phone: '011-2222222', is_active: true },
        { branch_id: 3, code: 'BRN003', name: 'Store B', address: '789 Elm St, Colombo', phone: '011-3333333', is_active: true },
        { branch_id: 4, code: 'BRN004', name: 'Store C', address: '321 Pine Rd, Colombo', phone: '011-4444444', is_active: true },
    ];

    // Sample data
    const items = [
        { product_id: 1, sku: 'BEV-CC-001', barcode: '9800123456789', name: 'Coca Cola 330ml', description: 'Carbonated beverage', category_id: 1, brand_id: 1, unit_id: 1, cost_price: 300.00, selling_price: 450.00, mrp: 500.00, reorder_level: 50, tax_rate: 8.00, is_active: true },
        { product_id: 2, sku: 'SNK-LC-001', barcode: '9800234567890', name: 'Lays Chips Classic', description: 'Fried snack chips', category_id: 2, brand_id: 2, unit_id: 2, cost_price: 75.00, selling_price: 120.00, mrp: 150.00, reorder_level: 30, tax_rate: 8.00, is_active: true },
        { product_id: 3, sku: 'DAI-MF-001', barcode: '9800345678901', name: 'Milk Fresh 1L', description: 'Pasteurized fresh milk', category_id: 3, brand_id: 3, unit_id: 3, cost_price: 250.00, selling_price: 380.00, mrp: 420.00, reorder_level: 20, tax_rate: 0.00, is_active: true },
        { product_id: 4, sku: 'GRN-RB-001', barcode: '9800456789012', name: 'Rice Basmati 5kg', description: 'Premium basmati rice', category_id: 4, brand_id: 4, unit_id: 4, cost_price: 1800.00, selling_price: 2500.00, mrp: 2800.00, reorder_level: 25, tax_rate: 0.00, is_active: true },
    ];

    const batches = [
        { batch_id: 1, product_id: 1, branch_id: 1, batch_code: 'CC-2025-001', manufacturing_date: '2025-06-15', expiry_date: '2026-06-15', qty: 100, cost_price: 300.00, created_at: '2025-06-15' },
        { batch_id: 2, product_id: 1, branch_id: 1, batch_code: 'CC-2025-002', manufacturing_date: '2025-08-28', expiry_date: '2026-02-28', qty: 145, cost_price: 300.00, created_at: '2025-08-28' },
        { batch_id: 3, product_id: 2, branch_id: 2, batch_code: 'LC-2025-045', manufacturing_date: '2025-09-10', expiry_date: '2026-03-10', qty: 12, cost_price: 75.00, created_at: '2025-09-10' },
        { batch_id: 4, product_id: 3, branch_id: 1, batch_code: 'MF-2026-001', manufacturing_date: '2025-12-15', expiry_date: '2026-01-15', qty: 0, cost_price: 250.00, created_at: '2025-12-15' },
        { batch_id: 5, product_id: 3, branch_id: 1, batch_code: 'MF-2026-002', manufacturing_date: '2025-12-08', expiry_date: '2026-01-08', qty: 0, cost_price: 250.00, created_at: '2025-12-08' },
        { batch_id: 6, product_id: 4, branch_id: 3, batch_code: 'RB-2025-012', manufacturing_date: '2025-12-31', expiry_date: '2026-12-31', qty: 89, cost_price: 1800.00, created_at: '2025-12-31' },
    ];
    const [batchFilterItem, setBatchFilterItem] = useState('');

    // State for Stock Adjustment
    const [adjustmentForm, setAdjustmentForm] = useState({ itemId: '', batchId: '', currentQty: '', physicalQty: '', adjustmentType: 'Increase', reason: 'Audit', approvedBy: '' });
    const [adjustments, setAdjustments] = useState([
        { id: 'ADJ001', itemName: 'Coca Cola 330ml', batchNumber: 'CC-2025-001', previousQty: 100, currentQty: 105, adjustmentType: 'Increase', reason: 'Audit', approvedBy: 'John Doe', date: '2026-01-10' },
        { id: 'ADJ002', itemName: 'Lays Chips Classic', batchNumber: 'LC-2025-045', previousQty: 15, currentQty: 12, adjustmentType: 'Decrease', reason: 'Damage', approvedBy: 'Jane Smith', date: '2026-01-09' },
    ]);

    // State for Damage Entry
    const [damageForm, setDamageForm] = useState({ itemId: '', batchId: '', quantity: '', reason: '', date: '', note: '' });
    const [damageEntries, setDamageEntries] = useState([
        { id: 'DMG001', itemName: 'Coca Cola 330ml', batchNumber: 'CC-2025-002', quantity: 5, reason: 'Breakage', date: '2026-01-10', note: 'Bottle damaged during unloading' },
        { id: 'DMG002', itemName: 'Lays Chips Classic', batchNumber: 'LC-2025-045', quantity: 3, reason: 'Expiry', date: '2026-01-08', note: 'Expired stock disposal' },
    ]);

    // State for Stock Transfer Create
    const [transferForm, setTransferForm] = useState({ fromBranch: '', toBranch: '', product_id: '', quantity: '', batch_id: '', transferDate: '', remarks: '', status: 'Draft' });
    const [transfers, setTransfers] = useState([
        { id: 'TRF001', fromWarehouse: 'Main Warehouse', toWarehouse: 'Store A', itemName: 'Coca Cola 330ml', quantity: 50, batchNumber: 'CC-2025-001', date: '2026-01-07', remarks: 'Stock replenishment', status: 'Draft', requestedBy: 'Manager 1' },
        { id: 'TRF002', fromWarehouse: 'Store A', toWarehouse: 'Store B', itemName: 'Lays Chips Classic', quantity: 20, batchNumber: 'LC-2025-045', date: '2026-01-06', remarks: 'Stock movement', status: 'Submitted', requestedBy: 'Manager 2' },
        { id: 'TRF003', fromWarehouse: 'Main Warehouse', toWarehouse: 'Store C', itemName: 'Rice Basmati 5kg', quantity: 30, batchNumber: 'RB-2025-012', date: '2026-01-05', remarks: 'Monthly distribution', status: 'Approved', requestedBy: 'Manager 3' },
    ]);

    // State for Item Detail
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemTab, setSelectedItemTab] = useState('summary');

    // Detailed item data for Item Detail screen
    const itemDetails = {
        1: {
            product_id: 1,
            sku: 'BEV-CC-001',
            barcode: '9800123456789',
            name: 'Coca Cola 330ml',
            priceHistory: [
                { date: '2025-12-15', selling_price: 450.00, change: '+5%', reason: 'Price increase due to inflation' },
                { date: '2025-11-01', selling_price: 428.57, change: '-2%', reason: 'Promotional discount' },
                { date: '2025-10-15', selling_price: 437.50, change: '+0%', reason: 'Stable' },
            ],
            stockHistory: [
                { date: '2026-01-10', type: 'GRN', reference: 'GRN-001', quantity: 100, notes: 'Goods received from Coca Cola Distributors' },
                { date: '2026-01-08', type: 'Sales', reference: 'INV-089', quantity: -50, notes: 'Sales to retail store A' },
                { date: '2026-01-05', type: 'Adjustment', reference: 'ADJ-001', quantity: 5, notes: 'Stock audit correction' },
                { date: '2026-01-02', type: 'Transfer', reference: 'TRF-001', quantity: -30, notes: 'Transfer to Store A' },
            ],
            supplierHistory: [
                { supplier_id: 1, name: 'Coca Cola Distributors', lastPO: 'PO-2026-001', lastDelivery: '2026-01-10', leadTime: '3 days', cost_price: 300.00, reliability: '98%' },
            ],
            reorderLevel: 50,
            reorderQuantity: 500,
        },
        2: {
            product_id: 2,
            sku: 'SNK-LC-001',
            barcode: '9800234567890',
            name: 'Lays Chips Classic',
            priceHistory: [
                { date: '2025-12-20', selling_price: 120.00, change: '+0%', reason: 'Stable' },
                { date: '2025-11-15', selling_price: 120.00, change: '+3%', reason: 'Manufacturing cost increase' },
            ],
            reorderLevel: 30,
            reorderQuantity: 200,
        },
        3: {
            product_id: 3,
            sku: 'DAI-MF-001',
            barcode: '9800345678901',
            name: 'Milk Fresh 1L',
            priceHistory: [
                { date: '2025-12-25', selling_price: 380.00, change: '+2%', reason: 'Premium pricing' },
            ],
            reorderLevel: 20,
            reorderQuantity: 150,
        },
        4: {
            product_id: 4,
            sku: 'GRN-RB-001',
            barcode: '9800456789012',
            name: 'Rice Basmati 5kg',
            priceHistory: [
                { date: '2025-12-18', selling_price: 2500.00, change: '+0%', reason: 'Stable' },
            ],
            reorderLevel: 25,
            reorderQuantity: 100,
        },
    };

    const stockTransfers = [
        { id: 'TRF001', fromBranch: 1, toBranch: 2, product_name: 'Laptop', quantity: 12, status: 'Pending', date: '2026-01-07' },
        { id: 'TRF002', fromBranch: 2, toBranch: 3, product_name: 'Desktop', quantity: 8, status: 'Approved', date: '2026-01-06' },
        { id: 'TRF003', fromBranch: 1, toBranch: 3, product_name: 'Monitor', quantity: 15, status: 'Completed', date: '2026-01-05' },
    ];

    const navigation = [
        {
            id: 'item-management', label: 'Item Management', icon: Package, screens: [
                { id: 'item-list', label: 'Item List', icon: Package },
                { id: 'item-detail', label: 'Item Detail', icon: FileText },
                { id: 'barcode-print', label: 'Barcode Print', icon: Printer },
            ]
        },
        {
            id: 'category-master', label: 'Category & Master', icon: Tag, screens: [
                { id: 'category-mgmt', label: 'Category Management', icon: Tag },
                { id: 'brand-mgmt', label: 'Brand Management', icon: Archive },
                { id: 'supplier-mgmt', label: 'Supplier Management', icon: Archive },
            ]
        },
        {
            id: 'stock-ops', label: 'Stock Operations', icon: Box, screens: [
                { id: 'stock-overview', label: 'Stock Overview', icon: BarChart3 },
                { id: 'batch-stock', label: 'Batch-wise Stock', icon: Package },
                { id: 'expiry-calendar', label: 'Expiry Calendar', icon: Calendar },
                { id: 'stock-adjustment', label: 'Stock Adjustment', icon: RefreshCw },
                { id: 'damage-entry', label: 'Damage Entry', icon: AlertTriangle },
            ]
        },
        {
            id: 'transfers', label: 'Transfers & Valuation', icon: ArrowRightLeft, screens: [
                { id: 'transfer-create', label: 'Create Transfer', icon: ArrowRightLeft },
                { id: 'approve-transfer', label: 'Transfer Approval', icon: CheckCircle },
                { id: 'stock-valuation', label: 'Stock Valuation', icon: TrendingUp },
                { id: 'stock-aging', label: 'Stock Aging Report', icon: Clock },
            ]
        },
    ];

    // Render logic handling props
    const renderScreen = () => {
        switch (activeScreen) {
            case 'item-list':
                return <ItemListScreen
                    items={items}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setIsAddModalOpen={setIsAddModalOpen}
                    setSelectedItemId={setSelectedItemId}
                    setActiveScreen={setActiveScreen}
                    handleDeleteItem={handleDeleteItem}
                    categories={categories}
                />;
            case 'item-detail':
                return <ItemDetailScreen
                    items={items}
                    itemDetails={itemDetails}
                    selectedItemId={selectedItemId}
                    setSelectedItemId={setSelectedItemId}
                    setActiveScreen={setActiveScreen}
                    selectedItemTab={selectedItemTab}
                    setSelectedItemTab={setSelectedItemTab}
                    batches={batches}
                />;
            case 'add-item':
                return <AddItemScreen setActiveScreen={setActiveScreen} />;
            case 'stock-overview':
                return <StockOverviewScreen
                    items={items}
                    categories={categories}
                    branches={branches}
                    stockFilterCategory={stockFilterCategory}
                    setStockFilterCategory={setStockFilterCategory}
                    stockFilterBranch={stockFilterWarehouse}
                    setStockFilterBranch={setStockFilterWarehouse}
                    stockFilterDate={stockFilterDate}
                    setStockFilterDate={setStockFilterDate}
                />;
            case 'batch-stock':
                return <BatchWiseStockScreen
                    batches={batches}
                    items={items}
                    batchFilterItem={batchFilterItem}
                    setBatchFilterItem={setBatchFilterItem}
                />;
            case 'expiry-calendar':
                return <ExpiryCalendarScreen batches={batches} />;
            case 'stock-adjustment':
                return <StockAdjustmentScreen
                    adjustmentForm={adjustmentForm}
                    setAdjustmentForm={setAdjustmentForm}
                    adjustments={adjustments}
                    setAdjustments={setAdjustments}
                    items={items}
                    batches={batches}
                />;
            case 'damage-entry':
                return <DamageEntryScreen
                    damageForm={damageForm}
                    setDamageForm={setDamageForm}
                    damageEntries={damageEntries}
                    setDamageEntries={setDamageEntries}
                    items={items}
                    batches={batches}
                />;
            case 'category-mgmt':
                return <CategoryManagementScreen
                    categories={categories}
                    categoryForm={categoryForm}
                    setCategoryForm={setCategoryForm}
                    isAddCategoryOpen={isAddCategoryOpen}
                    setIsAddCategoryOpen={setIsAddCategoryOpen}
                    handleAddCategory={handleAddCategory}
                    handleDeleteCategory={handleDeleteCategory}
                    handleEditCategory={handleEditCategory}
                    isEditMode={isEditMode && editingType === 'category'}
                    handleSaveEdit={handleSaveEdit}
                />;
            case 'brand-mgmt':
                return <BrandManagementScreen
                    brands={brands}
                    setBrands={setBrands}
                    isAddBrandOpen={isAddBrandOpen}
                    setIsAddBrandOpen={setIsAddBrandOpen}
                    brandForm={brandForm}
                    setBrandForm={setBrandForm}
                    suppliers={suppliers}
                    handleDeleteBrand={handleDeleteBrand}
                    handleEditBrand={handleEditBrand}
                    isEditMode={isEditMode && editingType === 'brand'}
                    handleSaveEdit={handleSaveEdit}
                />;
            case 'supplier-mgmt':
                return <SupplierManagementScreen
                    suppliers={suppliers}
                    setSuppliers={setSuppliers}
                    isAddSupplierOpen={isAddSupplierOpen}
                    setIsAddSupplierOpen={setIsAddSupplierOpen}
                    supplierForm={supplierForm}
                    setSupplierForm={setSupplierForm}
                    categories={categories}
                    handleDeleteSupplier={handleDeleteSupplier}
                    handleEditSupplier={handleEditSupplier}
                    isEditMode={isEditMode && editingType === 'supplier'}
                    handleSaveEdit={handleSaveEdit}
                />;
            case 'transfer-create':
                return <StockTransferCreateScreen
                    transferForm={transferForm}
                    setTransferForm={setTransferForm}
                    transfers={transfers}
                    setTransfers={setTransfers}
                    branches={branches}
                    items={items}
                    batches={batches}
                />;
            case 'approve-transfer':
                return <TransferApprovalScreen stockTransfers={stockTransfers} branches={branches} />;
            case 'stock-valuation':
                return <StockValuationScreen batches={batches} items={items} />;
            case 'stock-aging':
                return <StockAgingScreen batches={batches} />;
            case 'barcode-print':
                return (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50/50">
                        <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500">
                            <div className="relative mb-8 inline-block">
                                <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-2xl animate-pulse"></div>
                                <div className="relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <Printer size={64} className="text-brand-primary animate-bounce duration-3000" />
                                </div>
                            </div>

                            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-600 animate-pulse">
                                    Coming Soon
                                </span>
                            </h2>

                            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                                We're working hard to bring you a powerful Barcode Printing module.
                                <br />Get ready to print custom labels effortlessly!
                            </p>

                            <div className="flex items-center justify-center gap-3">
                                <div className="w-2.5 h-2.5 bg-brand-primary rounded-full animate-bounce border border-brand-primary/50" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2.5 h-2.5 bg-brand-primary/70 rounded-full animate-bounce border border-brand-primary/50" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2.5 h-2.5 bg-brand-primary/40 rounded-full animate-bounce border border-brand-primary/50" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <Package size={64} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">Screen Coming Soon</h3>
                            <p className="text-gray-600 mt-2">This feature is under development</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-72 bg-gray-900 text-white overflow-y-auto">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">SmartRetail <span className="text-emerald-400">Pro</span></h1>
                    <p className="text-sm text-gray-400 mt-1">Inventory Management</p>
                </div>

                <nav className="p-4">
                    {navigation.map((section) => (
                        <div key={section.id} className="mb-6">
                            <div className="flex items-center px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {section.label}
                            </div>
                            <div className="mt-2 space-y-1">
                                {section.screens.map((screen) => (
                                    <button
                                        key={screen.id}
                                        onClick={() => setActiveScreen(screen.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${activeScreen === screen.id
                                            ? 'bg-brand-primary text-white shadow-lg translate-x-1'
                                            : 'text-gray-300 hover:bg-gray-800 hover:translate-x-1 hover:text-white'
                                            }`}
                                    >
                                        <screen.icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                                        <span className="text-sm">{screen.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-14 bg-white border-b border-brand-border flex items-center justify-between px-5 gap-3 shrink-0">
                    <div className="flex flex-col">
                        <h1 className="font-extrabold leading-4 text-gray-900">Dashboard</h1>
                        <span className="text-xs text-brand-muted mt-1">Colombo Main Branch</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-slate-100 rounded text-xs font-medium text-gray-600">
                            {currentTime.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-xs font-medium text-gray-600">
                            <Clock size={14} />
                            <span className="font-mono">
                                {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>
                        <button className="px-3 py-1 bg-brand-primary hover:bg-brand-secondary text-white text-xs rounded transition-colors shadow-sm">
                            Logout
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    {renderScreen()}
                </div>
            </div>

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center animate-modal-blur">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-full sm:max-w-2xl md:max-w-3xl mx-4 sm:mx-6 z-10 max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <AddItemScreen onClose={() => setIsAddModalOpen(false)} setActiveScreen={setActiveScreen} />
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Category Modal */}
            {isAddCategoryOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center animate-modal-blur">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddCategoryOpen(false)}></div>
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 z-10 max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{isEditMode ? 'Edit Category' : 'Add New Category'}</h3>
                                <button onClick={() => setIsAddCategoryOpen(false)} className="text-gray-500 hover:text-gray-700">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                    <input
                                        type="text"
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                        placeholder="e.g., Beverages"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={categoryForm.description}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                        placeholder="e.g., Drinks and beverages"
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={categoryForm.is_active}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                                        id="isActive"
                                        className="rounded"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={() => setIsAddCategoryOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={isEditMode ? handleSaveEdit : handleAddCategory}
                                    className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary"
                                >
                                    {isEditMode ? 'Save Changes' : 'Add Category'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                    <button onClick={() => setIsAddBrandOpen(false)} className="text-gray-500 hover:text-gray-700">
                                        <X size={20} />
                                    </button>
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

            {/* Add Supplier Modal */}
            {isAddSupplierOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center animate-modal-blur">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddSupplierOpen(false)}></div>
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 z-10 max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Add Supplier</h2>
                                        <p className="text-gray-600 mt-1">Create a new supplier</p>
                                    </div>
                                    <button onClick={() => setIsAddSupplierOpen(false)} className="text-gray-500 hover:text-gray-700">
                                        <X size={20} />
                                    </button>
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

export default InventorySystem;
