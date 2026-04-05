import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import type { Task } from '../types';

export default function StoreManagerDashboard() {
  const { currentUser, users, tasks } = useApp();

  const storeEmployees = useMemo(() => {
    return users.filter(u => u.role === 'employee' && u.storeId === currentUser?.storeId && u.status === 'active');
  }, [users, currentUser]);

  const storeTasks = useMemo(() => {
    return tasks.filter(t => t.storeId === currentUser?.storeId);
  }, [tasks, currentUser]);

  const recentTasks = useMemo(() => {
    return storeTasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [storeTasks]);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return '#6b7280';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
    }
  };

  return (
    <Layout>
      <TopBar />
      <div className="page-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="page-header">
            <p className="page-header-label">Store Management</p>
            <h1>Manager Dashboard</h1>
            <p>Overview of your store operations and team performance.</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(245, 158, 11, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#d97706' }}>work</span>
            </div>
            <div className="metric-card-value">{storeEmployees.length}</div>
            <div className="metric-card-label">Employees</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(59, 130, 246, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>pending</span>
            </div>
            <div className="metric-card-value" style={{ color: '#2563eb' }}>{storeTasks.filter(t => t.status === 'pending').length}</div>
            <div className="metric-card-label">Pending Tasks</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(16, 185, 129, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#059669' }}>check_circle</span>
            </div>
            <div className="metric-card-value" style={{ color: '#059669' }}>{storeTasks.filter(t => t.status === 'completed').length}</div>
            <div className="metric-card-label">Completed Tasks</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(239, 68, 68, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#dc2626' }}>schedule</span>
            </div>
            <div className="metric-card-value" style={{ color: '#dc2626' }}>{storeTasks.filter(t => t.status === 'in_progress').length}</div>
            <div className="metric-card-label">In Progress</div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="table-container">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-container)' }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Recent Tasks</h3>
            <p style={{ margin: 0, color: 'var(--secondary)', fontSize: '0.875rem' }}>Latest task assignments and updates</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <span className="material-symbols-outlined">assignment</span>
                        <h3>No tasks yet</h3>
                        <p>Tasks will appear here once assigned.</p>
                      </div>
                    </td>
                  </tr>
                ) : recentTasks.map((t) => {
                  const employee = users.find(u => u.id === t.assignedTo);
                  return (
                    <tr key={t.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600 }}>{t.title}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--secondary)', marginTop: '0.25rem' }}>
                            {t.description.length > 60 ? t.description.slice(0, 60) + '...' : t.description}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.875rem' }}>
                        {employee?.name || 'Unknown'}
                      </td>
                      <td>
                        <span style={{
                          color: getPriorityColor(t.priority),
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {t.priority}
                        </span>
                      </td>
                      <td>
                        <span className="chip" style={{
                          background: `${getStatusColor(t.status)}20`,
                          color: getStatusColor(t.status),
                          border: `1px solid ${getStatusColor(t.status)}40`
                        }}>
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid var(--surface-container)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>
              Showing {recentTasks.length} of {storeTasks.length} total tasks
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}