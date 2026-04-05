import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  icon: string;
  label: string;
  path: string;
  roles?: string[]; // if specified, only show for these roles
}

const navItems: NavItem[] = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'group', label: 'Employees', path: '/employees', roles: ['store_manager'] },
  { icon: 'group', label: 'Users', path: '/users', roles: ['head_admin'] },
  { icon: 'store', label: 'Stores', path: '/stores', roles: ['head_admin'] },
  { icon: 'inventory_2', label: 'Inventory', path: '/inventory' },
  { icon: 'manage_accounts', label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { currentUser, logout, sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = currentUser?.role === 'head_admin';
  const isManager = currentUser?.role === 'store_manager';
  const isEmployee = currentUser?.role === 'employee';
  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setSidebarOpen(false);
  };

  const filteredNav = navItems.filter(item => !item.roles || item.roles.includes(currentUser?.role || ''));

  const getRoleDisplay = () => {
    switch (currentUser?.role) {
      case 'head_admin': return 'Head Admin';
      case 'store_manager': return 'Store Manager';
      case 'employee': return 'Employee';
      default: return 'User';
    }
  };

  const getPanelTitle = () => {
    switch (currentUser?.role) {
      case 'head_admin': return 'Admin Panel';
      case 'store_manager': return 'Manager Panel';
      case 'employee': return 'Employee Panel';
      default: return 'Store Panel';
    }
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <div style={{
              width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined filled" style={{ color: 'white', fontSize: 18 }}>inventory_2</span>
            </div>
            <div>
              <h2 style={{ marginBottom: 0 }}>{getPanelTitle()}</h2>
              <p>Global Logistics</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {filteredNav.map(item => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <span className={`material-symbols-outlined ${active ? 'filled' : ''}`}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="sidebar-user-name">{currentUser?.name}</div>
            <div className="sidebar-user-role">{getRoleDisplay()}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', padding: 4 }}
            title="Logout"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
