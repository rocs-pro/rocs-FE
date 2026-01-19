import React, { useState } from 'react';
import {
  LayoutGrid,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  Store
} from 'lucide-react';
import InventorySystem from './inventory/InventorySystem';

const App = () => {
  const [activeModule, setActiveModule] = useState('inventory');

  // Render the active module
  if (activeModule === 'inventory') {
    return (
      <div className="relative h-screen w-screen bg-white">
        {/* Floating Back Button */}
        {/* Floating Back Button - Commented out as per user request to remove menu screen
        <button
          onClick={() => setActiveModule(null)}
          className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white p-3 rounded-full shadow-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
          title="Back to Main Menu"
        >
          <LayoutGrid size={20} />
          <span className="font-medium pr-1">Main Menu</span>
        </button> 
        */}
        <InventorySystem />
      </div>
    );
  }

  // Placeholder for other modules
  const renderPlaceholder = (title, Icon) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 relative">
      <button
        onClick={() => setActiveModule(null)}
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        <LayoutGrid size={20} />
        <span>Back to Dashboard</span>
      </button>
      <div className="bg-white p-12 rounded-2xl shadow-sm text-center max-w-md w-full mx-4">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon size={40} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-8">This module is currently under development. Please check back later.</p>
        <button
          onClick={() => setActiveModule(null)}
          className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  if (activeModule === 'pos') return renderPlaceholder('Point of Sale', ShoppingCart);
  if (activeModule === 'admin') return renderPlaceholder('Admin Portal', Users);
  if (activeModule === 'reports') return renderPlaceholder('Reports & Analytics', TrendingUp);

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Store className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SmartRetail Pro</h1>
                <p className="text-xs text-gray-500">Enterprise Solution</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Manager</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff" alt="Profile" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back, John</h2>
          <p className="text-gray-600 mt-1">Select a module to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Inventory Module Card */}
          <button
            onClick={() => setActiveModule('inventory')}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left hover:-translate-y-1"
          >
            <div className="absolute top-6 right-6 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              ACTIVE
            </div>
            <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <Package size={28} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Inventory Management</h3>
            <p className="text-gray-500 text-sm mb-4">
              Manage stock levels, suppliers, purchase orders, and stock adjustments across all warehouses.
            </p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              Access Module <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </button>

          {/* POS Module Card */}
          <button
            onClick={() => setActiveModule('pos')}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left hover:-translate-y-1"
          >
            <div className="absolute top-6 right-6 bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">
              SOON
            </div>
            <div className="bg-purple-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <ShoppingCart size={28} className="text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Point of Sale</h3>
            <p className="text-gray-500 text-sm mb-4">
              Process sales, manage customers, and handle transactions with the POS interface.
            </p>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              Access Module <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </button>

          {/* Reports Module Card */}
          <button
            onClick={() => setActiveModule('reports')}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left hover:-translate-y-1"
          >
            <div className="absolute top-6 right-6 bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">
              SOON
            </div>
            <div className="bg-orange-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
              <TrendingUp size={28} className="text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reports & Analytics</h3>
            <p className="text-gray-500 text-sm mb-4">
              View detailed sales reports, inventory turnover, and financial analytics.
            </p>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              Access Module <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </button>

          {/* Admin Module Card */}
          <button
            onClick={() => setActiveModule('admin')}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left hover:-translate-y-1"
          >
            <div className="absolute top-6 right-6 bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">
              SOON
            </div>
            <div className="bg-gray-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
              <Users size={28} className="text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Portal</h3>
            <p className="text-gray-500 text-sm mb-4">
              Manage users, roles, system settings, and configurations.
            </p>
            <div className="flex items-center text-gray-600 text-sm font-medium">
              Access Module <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;