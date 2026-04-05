import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import type { User, Task, EmployeeDesignation, Gender } from '../types';

interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface EmployeeFormData {
  name: string;
  email: string;
  designation: EmployeeDesignation;
  mobileNumber: string;
  address: string;
  gender: Gender;
  education: string;
}

const emptyTaskForm: TaskFormData = { title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' };
const emptyEmployeeForm: EmployeeFormData = { 
  name: '', 
  email: '', 
  designation: 'salesman', 
  mobileNumber: '', 
  address: '', 
  gender: 'male', 
  education: '' 
};

const designationOptions = [
  { value: 'salesman', label: 'Salesman' },
  { value: 'cleaning_staff', label: 'Cleaning Staff' },
  { value: 'warehouse_staff', label: 'Warehouse Staff' },
  { value: 'sales_manager', label: 'Sales Manager' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'technician', label: 'Technician' },
  { value: 'delivery_staff', label: 'Delivery Staff' },
  { value: 'other', label: 'Other' },
];

export default function EmployeesPage() {
  const { currentUser, users, setUsers, tasks, setTasks, loginCredentials, setLoginCredentials, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskFormData, setTaskFormData] = useState<TaskFormData>(emptyTaskForm);
  const [employeeFormData, setEmployeeFormData] = useState<EmployeeFormData>(emptyEmployeeForm);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);

  const storeEmployees = useMemo(() => {
    return users.filter(u => u.role === 'employee' && u.storeId === currentUser?.storeId);
  }, [users, currentUser]);

  const filteredEmployees = useMemo(() => {
    return storeEmployees.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.designation?.toLowerCase().includes(search.toLowerCase())
    );
  }, [storeEmployees, search]);

  const employeeTasks = useMemo(() => {
    if (!selectedEmployee) return [];
    return tasks.filter(t => t.assignedTo === selectedEmployee.id && t.storeId === currentUser?.storeId);
  }, [tasks, selectedEmployee, currentUser]);

  const openAddEmployee = () => {
    setEmployeeFormData(emptyEmployeeForm);
    setShowEmployeeModal(true);
  };

  const openAssignTask = (employee: User) => {
    setSelectedEmployee(employee);
    setEditingTask(null);
    setTaskFormData({ ...emptyTaskForm, assignedTo: employee.id });
    setShowTaskModal(true);
  };

  const handleSaveEmployee = () => {
    if (!employeeFormData.name || !employeeFormData.email) {
      showToast('Name and email are required.', 'error');
      return;
    }

    if (!employeeFormData.mobileNumber || !employeeFormData.designation || !employeeFormData.address) {
      showToast('All fields are required.', 'error');
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email === employeeFormData.email)) {
      showToast('Email already exists.', 'error');
      return;
    }

    const newUserId = 'u' + Date.now();
    const newEmployee: User = {
      id: newUserId,
      name: employeeFormData.name,
      email: employeeFormData.email,
      role: 'employee',
      storeId: currentUser?.storeId,
      storeName: currentUser?.storeName,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      designation: employeeFormData.designation,
      mobileNumber: employeeFormData.mobileNumber,
      address: employeeFormData.address,
      gender: employeeFormData.gender,
      education: employeeFormData.education,
    };

    // Add login credentials for the new employee
    const newCredential = {
      email: employeeFormData.email,
      password: 'emp123', // Default password for employees
      userId: newUserId,
    };

    setUsers(prev => [newEmployee, ...prev]);
    setLoginCredentials(prev => [...prev, newCredential]);
    showToast('Employee added successfully! Default password: emp123');
    setShowEmployeeModal(false);
  };

  const handleSaveTask = () => {
    if (!taskFormData.title || !taskFormData.assignedTo) {
      showToast('Title and assigned employee are required.', 'error');
      return;
    }
    const now = new Date().toISOString();
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? {
        ...t,
        ...taskFormData,
        updatedAt: now,
      } : t));
      showToast('Task updated successfully!');
    } else {
      const newTask: Task = {
        id: 't' + Date.now(),
        title: taskFormData.title,
        description: taskFormData.description,
        assignedTo: taskFormData.assignedTo,
        assignedBy: currentUser!.id,
        storeId: currentUser!.storeId!,
        status: 'pending',
        priority: taskFormData.priority,
        dueDate: taskFormData.dueDate || undefined,
        createdAt: now,
        updatedAt: now,
      };
      setTasks(prev => [newTask, ...prev]);
      showToast('Task assigned successfully!');
    }
    setShowTaskModal(false);
  };

  const handleUpdateStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      status,
      updatedAt: new Date().toISOString(),
    } : t));
    showToast(`Task ${status === 'completed' ? 'completed' : status === 'in_progress' ? 'started' : 'cancelled'}.`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task deleted.', 'error');
  };

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

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const avatarColors = ['#00478d', '#00514a', '#515f74', '#7c3aed', '#b45309'];

  const getDesignationLabel = (designation?: EmployeeDesignation) => {
    return designationOptions.find(d => d.value === designation)?.label || 'N/A';
  };

  return (
    <Layout>
      <TopBar searchPlaceholder="Search employees..." onSearch={setSearch} />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <p className="page-header-label">Team Management</p>
            <h1>Employees</h1>
            <p>Manage your store employees and assign tasks.</p>
          </div>
          <button className="btn btn-primary" onClick={openAddEmployee}>
            <span className="material-symbols-outlined">person_add</span>
            Add Employee
          </button>
        </div>

        {/* Stats row */}
        <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(245, 158, 11, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#d97706' }}>work</span>
            </div>
            <div className="metric-card-value">{storeEmployees.length}</div>
            <div className="metric-card-label">Total Employees</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: '#d1fae5', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#059669' }}>check_circle</span>
            </div>
            <div className="metric-card-value" style={{ color: '#059669' }}>{storeEmployees.filter(e => e.status === 'active').length}</div>
            <div className="metric-card-label">Active Employees</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(59, 130, 246, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>assignment</span>
            </div>
            <div className="metric-card-value" style={{ color: '#2563eb' }}>{tasks.filter(t => t.storeId === currentUser?.storeId).length}</div>
            <div className="metric-card-label">Total Tasks</div>
          </div>
        </div>

        <div className="table-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Designation</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Tasks Assigned</th>
                  <th>Tasks Completed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <span className="material-symbols-outlined">group</span>
                        <h3>No employees found</h3>
                        <p>Try adjusting your search or add new employees.</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.map((employee, i) => {
                  const empTasks = tasks.filter(t => t.assignedTo === employee.id);
                  const completedTasks = empTasks.filter(t => t.status === 'completed').length;
                  return (
                    <tr key={employee.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: avatarColors[i % avatarColors.length],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.6875rem', fontWeight: 800,
                            fontFamily: 'Manrope, sans-serif', flexShrink: 0,
                          }}>{getInitials(employee.name)}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{employee.name}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--secondary)' }}>{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{getDesignationLabel(employee.designation)}</span>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                        {employee.mobileNumber || '—'}
                      </td>
                      <td>
                        <span className={`chip ${employee.status === 'active' ? 'chip-success' : 'chip-error'}`}>
                          <span className="status-dot" style={{ background: employee.status === 'active' ? '#34d399' : '#ba1a1a' }} />
                          {employee.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>{empTasks.length}</td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669' }}>{completedTasks}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openAssignTask(employee)} style={{ padding: '0.25rem 0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_task</span>
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedEmployee(employee)} style={{ padding: '0.25rem 0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid var(--surface-container)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>
              {filteredEmployees.length} of {storeEmployees.length} employees
            </span>
          </div>
        </div>

        {/* Employee Tasks Section */}
        {selectedEmployee && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>{selectedEmployee.name}</h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--secondary)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  <div><strong>Designation:</strong> {getDesignationLabel(selectedEmployee.designation)}</div>
                  <div><strong>Mobile:</strong> {selectedEmployee.mobileNumber}</div>
                  <div><strong>Gender:</strong> {selectedEmployee.gender?.charAt(0).toUpperCase() || 'N'}{selectedEmployee.gender?.slice(1) || 'A'}</div>
                  <div><strong>Education:</strong> {selectedEmployee.education}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Address:</strong> {selectedEmployee.address}</div>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedEmployee(null)}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                Close
              </button>
            </div>

            <div className="table-container" style={{ marginTop: '1rem' }}>
              <h3 style={{ padding: '1.5rem 1.5rem 0' }}>Assigned Tasks</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeTasks.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="empty-state">
                            <span className="material-symbols-outlined">assignment</span>
                            <h3>No tasks assigned</h3>
                            <p>Assign a task to get started.</p>
                          </div>
                        </td>
                      </tr>
                    ) : employeeTasks.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div>
                            <div style={{ fontWeight: 600 }}>{t.title}</div>
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
                        <td style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>
                          {t.dueDate || '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            {t.status === 'pending' && (
                              <button className="btn btn-sm" style={{ padding: '0.25rem 0.5rem', background: '#dbeafe', color: '#1d4ed8' }}
                                onClick={() => handleUpdateStatus(t.id, 'in_progress')}>
                                Start
                              </button>
                            )}
                            {t.status === 'in_progress' && (
                              <button className="btn btn-sm" style={{ padding: '0.25rem 0.5rem', background: '#d1fae5', color: '#065f46' }}
                                onClick={() => handleUpdateStatus(t.id, 'completed')}>
                                Complete
                              </button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(t.id)} style={{ padding: '0.25rem 0.5rem' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showEmployeeModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowEmployeeModal(false)}>
          <div className="modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button className="modal-close" onClick={() => setShowEmployeeModal(false)}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={employeeFormData.name}
                  onChange={e => setEmployeeFormData(f => ({ ...f, name: e.target.value }))} placeholder="e.g. John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" value={employeeFormData.email}
                  onChange={e => setEmployeeFormData(f => ({ ...f, email: e.target.value }))} placeholder="employee@nexus.com" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Designation *</label>
                <select className="form-select" value={employeeFormData.designation}
                  onChange={e => setEmployeeFormData(f => ({ ...f, designation: e.target.value as EmployeeDesignation }))}>
                  {designationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input className="form-input" type="tel" value={employeeFormData.mobileNumber}
                  onChange={e => setEmployeeFormData(f => ({ ...f, mobileNumber: e.target.value }))} placeholder="+91-9123456789" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select className="form-select" value={employeeFormData.gender}
                  onChange={e => setEmployeeFormData(f => ({ ...f, gender: e.target.value as Gender }))}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Education *</label>
                <input className="form-input" value={employeeFormData.education}
                  onChange={e => setEmployeeFormData(f => ({ ...f, education: e.target.value }))} placeholder="e.g. Bachelor of Commerce" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea className="form-input" rows={2} value={employeeFormData.address}
                onChange={e => setEmployeeFormData(f => ({ ...f, address: e.target.value }))} placeholder="Employee address..." />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEmployeeModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEmployee}>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowTaskModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Task' : `Assign Task to ${selectedEmployee?.name}`}</h3>
              <button className="modal-close" onClick={() => setShowTaskModal(false)}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input className="form-input" value={taskFormData.title}
                onChange={e => setTaskFormData(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Restock inventory" />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={taskFormData.description}
                onChange={e => setTaskFormData(f => ({ ...f, description: e.target.value }))} placeholder="Task details..." />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={taskFormData.priority}
                  onChange={e => setTaskFormData(f => ({ ...f, priority: e.target.value as 'low' | 'medium' | 'high' }))}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-input" type="date" value={taskFormData.dueDate}
                  onChange={e => setTaskFormData(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveTask}>
                {editingTask ? 'Save Changes' : 'Assign Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
