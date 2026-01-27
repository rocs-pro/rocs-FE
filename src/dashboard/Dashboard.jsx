import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InventorySystem from '../inventory/InventorySystem';

const Dashboard = () => {
    return (
        <Routes>
            <Route path="inventory" element={<InventorySystem />} />
            <Route path="/" element={<Navigate to="inventory" replace />} />
        </Routes>
    );
};

export default Dashboard;
