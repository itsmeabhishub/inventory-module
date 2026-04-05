import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';

export default function DashboardPage() {
  const { currentUser, products, stores, users } = useApp();
  const isAdmin = currentUser?.role === 'head_admin';

  // Compute metrics
  const myProducts = isAdmin
    ? products
    : products.filter(p => p.storeId === currentUser?.storeId);

  const totalStores = stores.filter(s => s.status === 'active').length;
  const totalProducts = myProducts.length;
  const lowStock = myProducts.filter(p => p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock').length;
  const warrantyExpiring = myProducts.filter(p => p.warrantyStatus === 'expiring_soon').length;
  const outOfStock = myProducts.filter(p => p.stockStatus === 'out_of_stock').length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  const recentProducts = [...myProducts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const stockLabel = (s: string) => {
    if (s === 'in_stock') return { label: 'In Stock', cls: 'chip-success' };
    if (s === 'low_stock') return { label: 'Low Stock', cls: 'chip-warning' };
    return { label: 'Out of Stock', cls: 'chip-error' };
  };

  return (
    <Layout>
      <TopBar searchPlaceholder="Search across all modules..." />
      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <p className="page-header-label">Logistics Overview</p>
          <h1>
            {isAdmin ? 'Systems are Optimal' : `${currentUser?.storeName ?? 'Store'} Overview`}
          </h1>
          <p>
            {isAdmin
              ? `Welcome back, ${currentUser?.name}. Here's a live snapshot of your global operations.`
              : `Welcome back, ${currentUser?.name}. Managing inventory for your store.`}
          </p>
        </div>

        {/* Metrics */}
        <div className="metric-grid">
          {isAdmin && (
            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="metric-card-icon" style={{ background: 'rgba(0,71,141,0.08)' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>store</span>
                </div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--tertiary)' }}>+2 this month</span>
              </div>
              <div className="metric-card-value">{totalStores}</div>
              <div className="metric-card-label">Total Active Stores</div>
            </div>
          )}

          <div className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="metric-card-icon" style={{ background: 'rgba(0,71,141,0.08)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>inventory</span>
              </div>
              <svg width="60" height="16" viewBox="0 0 60 16" style={{ color: 'var(--tertiary)' }}>
                <path d="M0 12 Q 15 4, 30 10 T 60 6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="metric-card-value">{totalProducts}</div>
            <div className="metric-card-label">Total Products</div>
          </div>

          <div className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="metric-card-icon" style={{ background: 'rgba(186,26,26,0.08)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>warning</span>
              </div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--error)' }}>
                {outOfStock} out of stock
              </span>
            </div>
            <div className="metric-card-value" style={{ color: lowStock > 0 ? 'var(--error)' : 'var(--on-surface)' }}>
              {lowStock}
            </div>
            <div className="metric-card-label">Low / Out of Stock</div>
          </div>

          <div className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="metric-card-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--amber)' }}>schedule</span>
              </div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#92400e' }}>Needs attention</span>
            </div>
            <div className="metric-card-value" style={{ color: warrantyExpiring > 0 ? '#b45309' : 'var(--on-surface)' }}>
              {warrantyExpiring}
            </div>
            <div className="metric-card-label">Warranty Expiring Soon</div>
          </div>

          {isAdmin && (
            <div className="metric-card" style={{ gridColumn: isAdmin ? 'span 1' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="metric-card-icon" style={{ background: 'rgba(0,81,74,0.08)' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>group</span>
                </div>
              </div>
              <div className="metric-card-value">{activeUsers}</div>
              <div className="metric-card-label">Active Users</div>
            </div>
          )}
        </div>

        {/* Activity section */}
        <div className="activity-section">
          {/* Recent products table */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--surface-container)' }}>
              <h3 className="section-title" style={{ marginBottom: 0 }}>Recent Inventory</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Stock</th>
                    <th>Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map(p => {
                    const stock = stockLabel(p.stockStatus);
                    const warranty = p.warrantyStatus === 'active'
                      ? { label: 'Active', cls: 'chip-success' }
                      : p.warrantyStatus === 'expiring_soon'
                        ? { label: 'Expiring Soon', cls: 'chip-warning' }
                        : { label: 'Expired', cls: 'chip-error' };
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--secondary)' }}>{p.sku}</div>
                        </td>
                        <td style={{ fontWeight: 700 }}>{p.quantity}</td>
                        <td><span className={`chip ${stock.cls}`}>{stock.label}</span></td>
                        <td><span className={`chip ${warranty.cls}`}>{warranty.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Stock breakdown */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 className="section-title">Stock Breakdown</h3>
              {[
                { label: 'In Stock', count: myProducts.filter(p => p.stockStatus === 'in_stock').length, color: '#34d399', bgColor: '#d1fae5' },
                { label: 'Low Stock', count: myProducts.filter(p => p.stockStatus === 'low_stock').length, color: '#f59e0b', bgColor: '#fef3c7' },
                { label: 'Out of Stock', count: myProducts.filter(p => p.stockStatus === 'out_of_stock').length, color: 'var(--error)', bgColor: 'var(--error-container)' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.625rem 0',
                  borderBottom: item.label !== 'Out of Stock' ? '1px solid var(--surface-container)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface)' }}>{item.label}</span>
                  </div>
                  <span style={{
                    fontSize: '0.8125rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif',
                    background: item.bgColor, color: item.color === '#34d399' ? '#065f46' : item.color,
                    padding: '2px 10px', borderRadius: '2rem',
                  }}>{item.count}</span>
                </div>
              ))}
            </div>

            {/* Warranty overview */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 className="section-title">Warranty Status</h3>
              {[
                { label: 'Active', count: myProducts.filter(p => p.warrantyStatus === 'active').length, color: '#34d399', bgColor: '#d1fae5' },
                { label: 'Expiring Soon', count: myProducts.filter(p => p.warrantyStatus === 'expiring_soon').length, color: 'var(--amber)', bgColor: 'var(--amber-container)' },
                { label: 'Expired', count: myProducts.filter(p => p.warrantyStatus === 'expired').length, color: 'var(--error)', bgColor: 'var(--error-container)' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.625rem 0',
                  borderBottom: item.label !== 'Expired' ? '1px solid var(--surface-container)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color === 'var(--amber)' ? '#f59e0b' : item.color === 'var(--error)' ? '#ba1a1a' : item.color }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface)' }}>{item.label}</span>
                  </div>
                  <span style={{
                    fontSize: '0.8125rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif',
                    background: item.bgColor, color: item.color === '#34d399' ? '#065f46' : item.color === 'var(--amber)' ? '#78350f' : '#93000a',
                    padding: '2px 10px', borderRadius: '2rem',
                  }}>{item.count}</span>
                </div>
              ))}
            </div>

            {isAdmin && (
              <div className="card" style={{ padding: '1.25rem' }}>
                <h3 className="section-title">Top Stores by Stock</h3>
                {stores.filter(s => s.status === 'active').slice(0, 4).map(s => (
                  <div key={s.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--surface-container)',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--secondary)' }}>{s.location}</div>
                    </div>
                    <span style={{ fontWeight: 800, fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', color: 'var(--primary)' }}>
                      {s.productCount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
