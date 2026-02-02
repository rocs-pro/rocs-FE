import {
  MdDashboard,
  MdAdminPanelSettings,
  MdPointOfSale,
  MdInventory,
  MdPeople,
} from 'react-icons/md';

export const getDashboardCards = (role) => {
  return [
    {
      title: role === 'admin' ? 'Admin Dashboard' : 'Manager Dashboard',
      subtitle:
        role === 'admin'
          ? 'System Control & Reports'
          : 'Analytics & Overview',
      color: '#2563eb',
      path: role === 'admin' ? '/admin' : '/manager',
      icon: role === 'admin' ? MdAdminPanelSettings : MdDashboard,
    },
    {
      title: 'POS',
      subtitle: 'Point of Sale System',
      color: '#16a34a',
      path: '/pos',
      icon: MdPointOfSale,
    },
    {
      title: 'Inventory',
      subtitle: 'Stock Management',
      color: '#f97316',
      path: '/inventory',
      icon: MdInventory,
    },
    {
      title: 'HR Module',
      subtitle: 'Human Resources',
      color: '#9d174d',
      badge: 'Coming Soon',
      disabled: true,
      icon: MdPeople,
    },
  ];
};
