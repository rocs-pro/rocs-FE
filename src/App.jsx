import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

import Dashboard from './dashboard/control-dashboard/Dashboard';
import AdminDashboard from './admin/AdminDashboard';
import ManagerDashboard from './dashboard/manager-dashboard/ManagerDashboard';
import PosPage from './pos/PosPage';
import InventoryPage from './inventory/InventoryPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
