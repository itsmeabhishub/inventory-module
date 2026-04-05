import { ReactNode } from 'react';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import InventoryPage from '../pages/InventoryPage';
import UsersPage from '../pages/UsersPage';
import StoresPage from '../pages/StoresPage';
import SettingsPage from '../pages/SettingsPage';
import StoreManagerDashboard from '../pages/StoreManagerDashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import EmployeesPage from '../pages/EmployeesPage';

export type UserRole = 'head_admin' | 'store_manager' | 'employee';

export interface RouteConfig {
  path: string;
  label: string;
  element: ReactNode;
  requiresAuth?: boolean;
  requiredRole?: UserRole | UserRole[];
  isPublic?: boolean;
  redirectTo?: string;
}

// Dashboard component selector based on user role
const DashboardElement = ({ currentUserRole }: { currentUserRole?: UserRole }) => {
  if (currentUserRole === 'store_manager') return <StoreManagerDashboard />;
  if (currentUserRole === 'employee') return <EmployeeDashboard />;
  return <DashboardPage />;
};

export const routes: RouteConfig[] = [
  // Public Routes
  {
    path: '/login',
    label: 'Login',
    element: <LoginPage />,
    isPublic: true,
  },

  // Protected Routes - Admin Dashboard
  {
    path: '/dashboard',
    label: 'Dashboard',
    element: <DashboardPage />,
    requiresAuth: true,
  },

  // Manager Routes
  {
    path: '/employees',
    label: 'Employees',
    element: <EmployeesPage />,
    requiresAuth: true,
    requiredRole: 'store_manager',
  },

  // Admin Routes
  {
    path: '/inventory',
    label: 'Inventory',
    element: <InventoryPage />,
    requiresAuth: true,
  },

  {
    path: '/users',
    label: 'Users',
    element: <UsersPage />,
    requiresAuth: true,
    requiredRole: 'head_admin',
  },

  {
    path: '/stores',
    label: 'Stores',
    element: <StoresPage />,
    requiresAuth: true,
    requiredRole: 'head_admin',
  },

  // Settings
  {
    path: '/settings',
    label: 'Settings',
    element: <SettingsPage />,
    requiresAuth: true,
  },
];

// Get menu routes (excludes login, dashboard redirects, etc)
export const getMenuRoutes = (userRole?: UserRole): RouteConfig[] => {
  return routes.filter((route) => {
    if (route.isPublic) return false;
    if (route.path === '/dashboard') return false;

    if (route.requiredRole) {
      if (Array.isArray(route.requiredRole)) {
        return route.requiredRole.includes(userRole || 'employee');
      }
      return route.requiredRole === userRole;
    }

    return true;
  });
};
