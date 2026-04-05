import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import type { Product, StockStatus, WarrantyStatus } from '../types';

function getStockStatus(qty: number): StockStatus {
  if (qty === 0) return 'out_of_stock';
  if (qty <= 10) return 'low_stock';
  return 'in_stock';
}

function getWarrantyStatus(endDate: string): WarrantyStatus {
  const end = new Date(endDate);
  const now = new Date();
  const diff = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'expired';
  if (diff <= 30) return 'expiring_soon';
  return 'active';
}

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  quantity: string;
  price: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
}

const CATEGORIES = ['Desktops', 'Laptops', 'Monitors', 'Networking', 'Peripherals', 'Power', 'Printers', 'Mini PCs', 'Storage'];

const emptyForm: ProductFormData = {
  name: '', sku: '', category: 'Laptops', quantity: '',
  price: '', warrantyStartDate: '', warrantyEndDate: '',
};

export default function StoreDetailsPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { products, setProducts, stores, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState('all');
  const [filterWarranty, setFilterWarranty] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const store = stores.find(s => s.id === storeId);

  if (!store) {
    return (
      <Layout>
        <TopBar />
        <div className="page-content">
          <div className="empty-state" style={{ paddingTop: '4rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--error)' }}>
              store
            </span>
            <h3>Store Not Found</h3>
            <p style={{ marginBottom: '1.5rem' }}>The store you're looking for doesn't exist.</p>
            <button className="btn btn-primary" onClick={() => navigate('/stores')}>
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Stores
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const storeProducts = products.filter(p => p.storeId === storeId);

  const filtered = useMemo(() => {
    return storeProducts.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchStock = filterStock === 'all' || p.stockStatus === filterStock;
      const matchWarranty = filterWarranty === 'all' || p.warrantyStatus === filterWarranty;
      return matchSearch && matchStock && matchWarranty;
    });
  }, [storeProducts, search, filterStock, filterWarranty]);

  const openAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name, sku: p.sku, category: p.category,
      quantity: String(p.quantity), price: String(p.price),
      warrantyStartDate: p.warrantyStartDate, warrantyEndDate: p.warrantyEndDate,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.sku || !formData.quantity || !formData.price) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    const qty = parseInt(formData.quantity);
    const stockStatus = getStockStatus(qty);
    const warrantyStatus = getWarrantyStatus(formData.warrantyEndDate || new Date().toISOString().slice(0, 10));

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p, ...formData, quantity: qty,
        price: parseFloat(formData.price),
        storeName: store.name,
        stockStatus, warrantyStatus,
      } : p));
      showToast('Product updated successfully!');
    } else {
      const newProduct: Product = {
        id: 'p' + Date.now(),
        name: formData.name, sku: formData.sku, category: formData.category,
        quantity: qty, price: parseFloat(formData.price),
        warrantyStartDate: formData.warrantyStartDate,
        warrantyEndDate: formData.warrantyEndDate,
        storeId: storeId || '', storeName: store.name,
        stockStatus, warrantyStatus,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setProducts(prev => [newProduct, ...prev]);
      showToast('Product added successfully!');
    }
    setShowModal(false);
  };

  const handleDelete = (p: Product) => {
    setProducts(prev => prev.filter(x => x.id !== p.id));
    setDeleteConfirm(null);
    showToast('Product deleted.', 'error');
  };

  const stockInfo = (s: string) => {
    if (s === 'in_stock') return { label: 'In Stock', cls: 'chip-success' };
    if (s === 'low_stock') return { label: 'Low Stock', cls: 'chip-warning' };
    return { label: 'Out of Stock', cls: 'chip-error' };
  };

  const warrantyInfo = (s: string) => {
    if (s === 'active') return { label: 'Active', cls: 'chip-success' };
    if (s === 'expiring_soon') return { label: 'Expiring Soon', cls: 'chip-warning' };
    return { label: 'Expired', cls: 'chip-error' };
  };

  const totalValue = filtered.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <Layout>
      <TopBar searchPlaceholder="Search by product name, SKU..." onSearch={setSearch} />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/stores')} style={{ marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Stores
            </button>
            <p className="page-header-label">Store Inventory</p>
            <h1>{store.name}</h1>
            <p style={{ marginTop: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: '0.25rem' }}>location_on</span>
              {store.location}
            </p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            <span className="material-symbols-outlined">add_box</span>
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(0,71,141,0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>inventory_2</span>
            </div>
            <div className="metric-card-value">{storeProducts.length}</div>
            <div className="metric-card-label">Total Products</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: '#d1fae5', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#065f46' }}>check_circle</span>
            </div>
            <div className="metric-card-value" style={{ color: '#065f46' }}>{storeProducts.filter(p => p.stockStatus === 'in_stock').length}</div>
            <div className="metric-card-label">In Stock</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(245, 158, 11, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#d97706' }}>warning</span>
            </div>
            <div className="metric-card-value" style={{ color: '#d97706' }}>{storeProducts.filter(p => p.stockStatus === 'low_stock').length}</div>
            <div className="metric-card-label">Low Stock</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-icon" style={{ background: 'rgba(239, 68, 68, 0.08)', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#dc2626' }}>currency_rupee</span>
            </div>
            <div className="metric-card-value" style={{ color: '#dc2626' }}>
              ₹{(totalValue / 100000).toFixed(1)}L
            </div>
            <div className="metric-card-label">Stock Value</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary)' }}>Stock Status:</label>
            <select value={filterStock} onChange={e => setFilterStock(e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--outline-variant)', background: 'var(--surface-container)', color: 'var(--on-surface)', cursor: 'pointer' }}>
              <option value="all">All</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary)' }}>Warranty:</label>
            <select value={filterWarranty} onChange={e => setFilterWarranty(e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--outline-variant)', background: 'var(--surface-container)', color: 'var(--on-surface)', cursor: 'pointer' }}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <div className="table-toolbar">
            <div className="table-toolbar-search">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Warranty</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="empty-state">
                        <span className="material-symbols-outlined">inventory_2</span>
                        <h3>No products found</h3>
                        <p>Add products to this store to see them here.</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map(p => {
                  const stock = stockInfo(p.stockStatus);
                  const warranty = warrantyInfo(p.warrantyStatus);
                  return (
                    <tr key={p.id}>
                      <td><div style={{ fontWeight: 600 }}>{p.name}</div></td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--secondary)', fontFamily: 'monospace' }}>{p.sku}</td>
                      <td style={{ fontSize: '0.875rem' }}>{p.category}</td>
                      <td style={{ fontWeight: 700, fontFamily: 'Manrope, sans-serif' }}>{p.quantity}</td>
                      <td style={{ fontWeight: 700, fontFamily: 'Manrope, sans-serif', color: 'var(--primary)' }}>₹{p.price.toLocaleString()}</td>
                      <td><span className={`chip ${stock.cls}`}><span className="status-dot" style={{ background: stock.cls === 'chip-success' ? '#34d399' : stock.cls === 'chip-warning' ? '#f59e0b' : '#ef4444' }} />{stock.label}</span></td>
                      <td><span className={`chip ${warranty.cls}`}>{warranty.label}</span></td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>{p.createdAt}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} style={{ padding: '0.25rem 0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(p)} style={{ padding: '0.25rem 0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="form-input" value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Dell XPS 13" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">SKU *</label>
                <input className="form-input" value={formData.sku}
                  onChange={e => setFormData(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. DELL-XPS-13-001" />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={formData.category}
                  onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input className="form-input" type="number" value={formData.quantity}
                  onChange={e => setFormData(f => ({ ...f, quantity: e.target.value }))} placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input className="form-input" type="number" value={formData.price}
                  onChange={e => setFormData(f => ({ ...f, price: e.target.value }))} placeholder="0" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Warranty Start Date</label>
                <input className="form-input" type="date" value={formData.warrantyStartDate}
                  onChange={e => setFormData(f => ({ ...f, warrantyStartDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Warranty End Date</label>
                <input className="form-input" type="date" value={formData.warrantyEndDate}
                  onChange={e => setFormData(f => ({ ...f, warrantyEndDate: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="confirm-dialog">
            <h3>Delete Product?</h3>
            <p>Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
