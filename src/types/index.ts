export type UserRole = 'head_admin' | 'store_manager' | 'employee';
export type EmployeeDesignation = 'salesman' | 'cleaning_staff' | 'warehouse_staff' | 'sales_manager' | 'supervisor' | 'technician' | 'delivery_staff' | 'other';
export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string;
  storeName?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  // Employee-specific fields
  designation?: EmployeeDesignation;
  mobileNumber?: string;
  address?: string;
  gender?: Gender;
  education?: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  managerName?: string;
  managerId?: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  warrantyStartDate: string;
  warrantyEndDate: string;
  storeId: string;
  storeName: string;
  stockStatus: StockStatus;
  warrantyStatus: WarrantyStatus;
  createdAt: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // employee id
  assignedBy: string; // manager id
  storeId: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}
