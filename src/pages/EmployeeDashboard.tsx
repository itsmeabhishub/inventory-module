import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import type { Task, TaskStatus } from '../types';

export default function EmployeeDashboard() {
  const { currentUser, tasks, setTasks, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const myTasks = useMemo(() => {
    return tasks.filter(t => t.assignedTo === currentUser?.id);
  }, [tasks, currentUser]);

  const filteredTasks = useMemo(() => {
    return myTasks.filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || t.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [myTasks, search, filterStatus]);

  const handleUpdateStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      status,
      updatedAt: new Date().toISOString(),
    } : t));
    showToast(`Task ${status === 'completed' ? 'completed' : status === 'in_progress' ? 'started' : 'cancelled'}.`);
  };

  const getStatusColor = (status: TaskStatus) => {
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

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <Layout>
      <TopBar searchPlaceholder="Search my tasks..." onSearch={setSearch} />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <p className="page-header-label">Employee Workspace</p>
            <h1>My Tasks</h1>
            <p>View and manage tasks assigned by your manager.</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(59, 130, 246, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>pending</span>
            </div>
            <div className="metric-card-value" style={{ color: '#2563eb' }}>{myTasks.filter(t => t.status === 'pending').length}</div>
            <div className="metric-card-label">Pending Tasks</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(239, 68, 68, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#dc2626' }}>schedule</span>
            </div>
            <div className="metric-card-value" style={{ color: '#dc2626' }}>{myTasks.filter(t => t.status === 'in_progress').length}</div>
            <div className="metric-card-label">In Progress</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(16, 185, 129, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#059669' }}>check_circle</span>
            </div>
            <div className="metric-card-value" style={{ color: '#059669' }}>{myTasks.filter(t => t.status === 'completed').length}</div>
            <div className="metric-card-label">Completed</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(245, 158, 11, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#d97706' }}>warning</span>
            </div>
            <div className="metric-card-value" style={{ color: '#d97706' }}>{myTasks.filter(t => isOverdue(t.dueDate)).length}</div>
            <div className="metric-card-label">Overdue</div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <div className="table-toolbar-search">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="table-toolbar-actions">
              <select className="form-select" style={{ minWidth: 140, borderRadius: '0.5rem', padding: '0.4rem 0.75rem' }}
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Assigned</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <span className="material-symbols-outlined">task</span>
                        <h3>No tasks found</h3>
                        <p>Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTasks.map((t) => (
                  <tr key={t.id} style={{ background: isOverdue(t.dueDate) && t.status !== 'completed' ? 'rgba(239, 68, 68, 0.05)' : undefined }}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {t.title}
                          {isOverdue(t.dueDate) && t.status !== 'completed' && (
                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#ef4444' }}>schedule</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--secondary)', marginTop: '0.25rem' }}>
                          {t.description}
                        </div>
                      </div>
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
                    <td style={{ fontSize: '0.8125rem', color: isOverdue(t.dueDate) && t.status !== 'completed' ? '#ef4444' : 'var(--secondary)' }}>
                      {t.dueDate || '—'}
                      {isOverdue(t.dueDate) && t.status !== 'completed' && ' (Overdue)'}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        {t.status === 'pending' && (
                          <button className="btn btn-sm" style={{ padding: '0.25rem 0.5rem', background: '#dbeafe', color: '#1d4ed8' }}
                            onClick={() => handleUpdateStatus(t.id, 'in_progress')}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_arrow</span>
                            Start
                          </button>
                        )}
                        {t.status === 'in_progress' && (
                          <button className="btn btn-sm" style={{ padding: '0.25rem 0.5rem', background: '#d1fae5', color: '#065f46' }}
                            onClick={() => handleUpdateStatus(t.id, 'completed')}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                            Complete
                          </button>
                        )}
                        {t.status === 'pending' && (
                          <button className="btn btn-ghost btn-sm" style={{ padding: '0.25rem 0.5rem', color: '#ef4444' }}
                            onClick={() => handleUpdateStatus(t.id, 'cancelled')}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid var(--surface-container)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>
              {filteredTasks.length} of {myTasks.length} tasks
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}