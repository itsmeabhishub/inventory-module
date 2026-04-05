import type { User, Store, Product, Task } from '../types';

export const DUMMY_USERS: User[] = [
  { id: 'u1', name: 'Alex Sterling', email: 'alex.sterling@nexus.com', role: 'head_admin', status: 'active', createdAt: '2024-01-10' },
  { id: 'u2', name: 'Jordan Patel', email: 'jordan.patel@nexus.com', role: 'store_manager', storeId: 's1', storeName: 'Downtown Hub A1', status: 'active', createdAt: '2024-02-15' },
  { id: 'u3', name: 'Morgan Lee', email: 'morgan.lee@nexus.com', role: 'store_manager', storeId: 's2', storeName: 'Westside Depot B2', status: 'active', createdAt: '2024-03-05' },
  { id: 'u4', name: 'Riley Chen', email: 'riley.chen@nexus.com', role: 'store_manager', storeId: 's3', storeName: 'North Gate C3', status: 'inactive', createdAt: '2024-03-22' },
  { id: 'u5', name: 'Avery Smith', email: 'avery.smith@nexus.com', role: 'store_manager', storeId: 's4', storeName: 'Eastview Warehouse D4', status: 'active', createdAt: '2024-04-11' },
  { id: 'u6', name: 'Sam Torres', email: 'sam.torres@nexus.com', role: 'store_manager', storeId: 's5', storeName: 'Harbor Point E5', status: 'active', createdAt: '2024-05-01' },
  { id: 'u7', name: 'Taylor Johnson', email: 'taylor.johnson@nexus.com', role: 'employee', storeId: 's1', storeName: 'Downtown Hub A1', status: 'active', createdAt: '2024-06-01', designation: 'salesman', mobileNumber: '+91-9123456789', address: '123 Main St, Mumbai', gender: 'male', education: 'Bachelor of Commerce' },
  { id: 'u8', name: 'Casey Brown', email: 'casey.brown@nexus.com', role: 'employee', storeId: 's1', storeName: 'Downtown Hub A1', status: 'active', createdAt: '2024-06-05', designation: 'cleaning_staff', mobileNumber: '+91-9234567890', address: '456 Oak Ave, Mumbai', gender: 'female', education: 'High School' },
  { id: 'u9', name: 'Jamie Wilson', email: 'jamie.wilson@nexus.com', role: 'employee', storeId: 's2', storeName: 'Westside Depot B2', status: 'active', createdAt: '2024-06-10', designation: 'warehouse_staff', mobileNumber: '+91-9345678901', address: '789 Pine Rd, Delhi', gender: 'male', education: 'Higher Secondary' },
  { id: 'u10', name: 'Drew Garcia', email: 'drew.garcia@nexus.com', role: 'employee', storeId: 's4', storeName: 'Eastview Warehouse D4', status: 'active', createdAt: '2024-06-15', designation: 'technician', mobileNumber: '+91-9456789012', address: '321 Elm St, Chennai', gender: 'male', education: 'Diploma in Electronics' },
];

export const DUMMY_STORES: Store[] = [
  { id: 's1', name: 'Downtown Hub A1', location: 'Mumbai, Maharashtra', managerName: 'Jordan Patel', managerId: 'u2', productCount: 142, status: 'active', createdAt: '2024-01-20' },
  { id: 's2', name: 'Westside Depot B2', location: 'Delhi, NCR', managerName: 'Morgan Lee', managerId: 'u3', productCount: 98, status: 'active', createdAt: '2024-02-05' },
  { id: 's3', name: 'North Gate C3', location: 'Bangalore, Karnataka', managerName: 'Riley Chen', managerId: 'u4', productCount: 67, status: 'inactive', createdAt: '2024-02-20' },
  { id: 's4', name: 'Eastview Warehouse D4', location: 'Chennai, Tamil Nadu', managerName: 'Avery Smith', managerId: 'u5', productCount: 215, status: 'active', createdAt: '2024-03-15' },
  { id: 's5', name: 'Harbor Point E5', location: 'Hyderabad, Telangana', managerName: 'Sam Torres', managerId: 'u6', productCount: 88, status: 'active', createdAt: '2024-04-01' },
  { id: 's6', name: 'Sunrise Logistics F6', location: 'Pune, Maharashtra', productCount: 0, status: 'active', createdAt: '2024-05-10' },
];

export const DUMMY_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Restock Dell OptiPlex Desktops',
    description: 'Restock the Dell OptiPlex 7000 desktops in aisle 3. Check inventory levels and place order if needed.',
    assignedTo: 'u7',
    assignedBy: 'u2',
    storeId: 's1',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-12-20',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
  },
  {
    id: 't2',
    title: 'Clean and organize storage area',
    description: 'Clean the storage area in the back and organize products by category.',
    assignedTo: 'u8',
    assignedBy: 'u2',
    storeId: 's1',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-12-18',
    createdAt: '2024-12-14T14:30:00Z',
    updatedAt: '2024-12-16T09:15:00Z',
  },
  {
    id: 't3',
    title: 'Update inventory records',
    description: 'Update the inventory records for networking equipment and verify quantities.',
    assignedTo: 'u9',
    assignedBy: 'u3',
    storeId: 's2',
    status: 'completed',
    priority: 'low',
    dueDate: '2024-12-17',
    createdAt: '2024-12-13T11:20:00Z',
    updatedAt: '2024-12-16T16:45:00Z',
  },
  {
    id: 't4',
    title: 'Prepare shipment for customer order',
    description: 'Prepare and package items for customer order #12345.',
    assignedTo: 'u10',
    assignedBy: 'u5',
    storeId: 's4',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-12-19',
    createdAt: '2024-12-16T08:00:00Z',
    updatedAt: '2024-12-16T08:00:00Z',
  },
];

function getStockStatus(qty: number) {
  if (qty === 0) return 'out_of_stock' as const;
  if (qty <= 10) return 'low_stock' as const;
  return 'in_stock' as const;
}

function getWarrantyStatus(endDate: string) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'expired' as const;
  if (diff <= 30) return 'expiring_soon' as const;
  return 'active' as const;
}

const rawProducts = [
  { id: 'p1', name: 'Dell OptiPlex 7000', sku: 'DOP-7000-X', category: 'Desktops', quantity: 45, price: 82500, wStart: '2022-06-01', wEnd: '2025-06-01', storeId: 's1', storeName: 'Downtown Hub A1' },
  { id: 'p2', name: 'HP ProBook 450 G9', sku: 'HPB-450G9', category: 'Laptops', quantity: 8, price: 62000, wStart: '2023-01-15', wEnd: '2026-01-15', storeId: 's1', storeName: 'Downtown Hub A1' },
  { id: 'p3', name: 'Lenovo ThinkPad X1', sku: 'LTP-X1-C10', category: 'Laptops', quantity: 0, price: 135000, wStart: '2022-03-10', wEnd: '2025-03-10', storeId: 's1', storeName: 'Downtown Hub A1' },
  { id: 'p4', name: 'Samsung 27" 4K Monitor', sku: 'SAM-27-4K', category: 'Monitors', quantity: 23, price: 38000, wStart: '2023-07-01', wEnd: '2026-07-01', storeId: 's2', storeName: 'Westside Depot B2' },
  { id: 'p5', name: 'Cisco Catalyst 2960', sku: 'CIS-2960-X', category: 'Networking', quantity: 5, price: 45000, wStart: '2021-11-20', wEnd: '2024-11-20', storeId: 's2', storeName: 'Westside Depot B2' },
  { id: 'p6', name: 'Apple MacBook Pro 14"', sku: 'APL-MBP-14', category: 'Laptops', quantity: 12, price: 210000, wStart: '2024-01-05', wEnd: '2027-01-05', storeId: 's2', storeName: 'Westside Depot B2' },
  { id: 'p7', name: 'Logitech MX Master 3', sku: 'LOG-MX3-S', category: 'Peripherals', quantity: 3, price: 9500, wStart: '2023-09-01', wEnd: '2025-09-01', storeId: 's3', storeName: 'North Gate C3' },
  { id: 'p8', name: 'APC UPS 1500VA', sku: 'APC-UPS-15', category: 'Power', quantity: 0, price: 18500, wStart: '2022-05-15', wEnd: '2024-05-15', storeId: 's4', storeName: 'Eastview Warehouse D4' },
  { id: 'p9', name: 'HP LaserJet Pro M404', sku: 'HPL-404-N', category: 'Printers', quantity: 17, price: 28000, wStart: '2023-03-20', wEnd: '2026-03-20', storeId: 's4', storeName: 'Eastview Warehouse D4' },
  { id: 'p10', name: 'Intel NUC 12 Pro', sku: 'INT-NUC12', category: 'Mini PCs', quantity: 7, price: 55000, wStart: '2023-11-01', wEnd: '2025-11-01', storeId: 's5', storeName: 'Harbor Point E5' },
  { id: 'p11', name: 'Ubiquiti UniFi AP', sku: 'UBQ-UAP-AC', category: 'Networking', quantity: 2, price: 14000, wStart: '2023-04-10', wEnd: '2025-04-10', storeId: 's5', storeName: 'Harbor Point E5' },
  { id: 'p12', name: 'Seagate 4TB NAS Drive', sku: 'SEA-4TB-IW', category: 'Storage', quantity: 31, price: 8200, wStart: '2024-02-01', wEnd: '2027-02-01', storeId: 's4', storeName: 'Eastview Warehouse D4' },
  { id: 'p13', name: 'Synology DS920+', sku: 'SYN-DS920', category: 'Storage', quantity: 9, price: 48000, wStart: '2022-08-15', wEnd: '2025-08-15', storeId: 's1', storeName: 'Downtown Hub A1' },
  { id: 'p14', name: 'Jabra Evolve2 85', sku: 'JAB-EV2-85', category: 'Peripherals', quantity: 4, price: 22000, wStart: '2023-06-20', wEnd: '2025-06-20', storeId: 's2', storeName: 'Westside Depot B2' },
  { id: 'p15', name: 'Asus ProArt PA278', sku: 'ASUS-PA278', category: 'Monitors', quantity: 0, price: 52000, wStart: '2021-12-01', wEnd: '2024-12-01', storeId: 's3', storeName: 'North Gate C3' },
];

export const DUMMY_PRODUCTS: Product[] = rawProducts.map(p => ({
  ...p,
  warrantyStartDate: p.wStart,
  warrantyEndDate: p.wEnd,
  stockStatus: getStockStatus(p.quantity),
  warrantyStatus: getWarrantyStatus(p.wEnd),
  createdAt: p.wStart,
}));

export const LOGIN_CREDENTIALS = [
  { email: 'alex.sterling@nexus.com', password: 'admin123', userId: 'u1' },
  { email: 'jordan.patel@nexus.com', password: 'store123', userId: 'u2' },
  { email: 'morgan.lee@nexus.com', password: 'store123', userId: 'u3' },
  { email: 'riley.chen@nexus.com', password: 'store123', userId: 'u4' },
  { email: 'avery.smith@nexus.com', password: 'store123', userId: 'u5' },
  { email: 'sam.torres@nexus.com', password: 'store123', userId: 'u6' },
  { email: 'taylor.johnson@nexus.com', password: 'emp123', userId: 'u7' },
  { email: 'casey.brown@nexus.com', password: 'emp123', userId: 'u8' },
  { email: 'jamie.wilson@nexus.com', password: 'emp123', userId: 'u9' },
  { email: 'drew.garcia@nexus.com', password: 'emp123', userId: 'u10' },
];
