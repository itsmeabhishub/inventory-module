import { Navigate, Routes, Route } from 'react-router-dom';
import { ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import StoreManagerDashboard from '../pages/StoreManagerDashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import { routes } from './index';
import type { UserRole } from './index';

// Route Guards
interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({ children, requiredRole }: RouteGuardProps) {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(currentUser.role as UserRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: RouteGuardProps) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'head_admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function ManagerRoute({ children }: RouteGuardProps) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'store_manager') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function EmployeeRoute({ children }: RouteGuardProps) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'employee') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// App Routes Component
export function AppRoutes() {
  const { currentUser } = useApp();

  const getDashboardElement = () => {
    switch (currentUser?.role) {
      case 'store_manager':
        return <StoreManagerDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={
          currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      {/* Dashboard Route - Shows different dashboard based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {getDashboardElement()}
          </ProtectedRoute>
        }
      />

      {/* Admin-only Routes */}
      <Route
        path="/users"
        element={
          <AdminRoute>
            {routes.find(r => r.path === '/users')?.element}
          </AdminRoute>
        }
      />

      <Route
        path="/stores"
        element={
          <AdminRoute>
            {routes.find(r => r.path === '/stores')?.element}
          </AdminRoute>
        }
      />

      {/* Manager-only Routes */}
      <Route
        path="/employees"
        element={
          <ManagerRoute>
            {routes.find(r => r.path === '/employees')?.element}
          </ManagerRoute>
        }
      />

      {/* Protected Routes - Available to all authenticated users */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            {routes.find(r => r.path === '/inventory')?.element}
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            {routes.find(r => r.path === '/settings')?.element}
          </ProtectedRoute>
        }
      />

      {/* Catch-all - Redirect to dashboard or login */}
      <Route
        path="*"
        element={
          <Navigate
            to={currentUser ? '/dashboard' : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}
