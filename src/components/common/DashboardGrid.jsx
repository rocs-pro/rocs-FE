import DashboardCard from './DashboardCard';
import { getUserRole } from '../../services/authApi';

import {
  MdDashboard,
  MdPointOfSale,
  MdInventory,
  MdPeople,
} from 'react-icons/md';

const DashboardGrid = () => {
  const role = getUserRole();

  const cards = [
    {
      title: role === 'admin' ? 'Admin Dashboard' : 'Manager Dashboard',
      subtitle:
        role === 'admin'
          ? 'System Overview'
          : 'Analytics & Overview',
      icon: MdDashboard,
      color: '#2563eb',
      path:
        role === 'admin'
          ? '/admin-dashboard'
          : '/manager-dashboard',
    },
    {
      title: 'POS',
      subtitle: 'Point of Sale System',
      icon: MdPointOfSale,
      color: '#16a34a',
      path: '/pos',
    },
    {
      title: 'Inventory',
      subtitle: 'Stock Management',
      icon: MdInventory,
      color: '#f97316',
      path: '/inventory',
    },
    {
      title: 'HR Module',
      subtitle: 'Human Resources',
      icon: MdPeople,
      color: '#7c1d4f',
      disabled: true,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '50px',
        justifyContent: 'center',
        marginTop: '40px',
        maxWidth: '1000px',
        margin: '40px auto 0',
      }}
    >
      {cards.map((card, index) => (
        <DashboardCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DashboardGrid;
