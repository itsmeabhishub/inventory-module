import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
}

export default function TopBar({ searchPlaceholder = 'Search...', onSearch }: TopBarProps) {
  const { currentUser, logout, setSidebarOpen, isDarkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <button
          className="icon-btn"
          style={{ display: 'none' }}
          onClick={() => setSidebarOpen(true)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="topbar-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={e => onSearch?.(e.target.value)}
          />
        </div>
      </div>
      <div className="topbar-actions">
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotif(!showNotif)}>
            <span className="material-symbols-outlined">notifications</span>
            <span className="notification-dot" />
          </button>
          {showNotif && (
            <div style={{
              position: 'absolute', right: 0, top: '110%',
              background: 'var(--surface-container-lowest)',
              borderRadius: '0.75rem', padding: '1rem',
              boxShadow: '0 8px 24px rgba(0,71,141,0.15)',
              width: 260, zIndex: 100,
            }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.75rem' }}>NOTIFICATIONS</p>
              {['5 items low on stock', 'Warranty expiring: 3 items', 'New store added'].map((n, i) => (
                <div key={i} style={{
                  padding: '0.5rem 0',
                  borderBottom: i < 2 ? '1px solid var(--surface-container)' : 'none',
                  fontSize: '0.8125rem', color: 'var(--on-surface)',
                }}>
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="icon-btn" onClick={toggleDarkMode} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.6875rem', fontWeight: 800,
            fontFamily: 'Manrope, sans-serif',
          }}>{initials}</div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--on-surface)' }}>
            {currentUser?.name?.split(' ')[0]}
          </span>
        </div>
        <div style={{ width: 1, height: 20, background: 'var(--outline-variant)', opacity: 0.4 }} />
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
