import { useCallback, useEffect, useState } from 'react';
import * as api from '../api.js';

const empty = { name: '', description: '', price: '', stock: '' };

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.listProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price != null ? String(p.price) : '',
      stock: p.stock != null ? String(p.stock) : ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(empty);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || form.price === '') {
      setError('Name and price are required.');
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: form.stock === '' ? 0 : Number(form.stock)
    };
    setSubmitting(true);
    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
      } else {
        await api.createProduct(payload);
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <section className="panel form-panel">
        <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              minLength={2}
              maxLength={120}
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              maxLength={1000}
              rows={3}
            />
          </label>
          <label>
            Price
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </label>
          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button type="button" className="btn ghost" onClick={cancelEdit} disabled={submitting}>
                Cancel
              </button>
            )}
          </div>
          {error && <p className="msg error">{error}</p>}
        </form>
      </section>

      <section className="panel list-panel">
        <div className="list-header">
          <h2>Your Products</h2>
          <button className="btn ghost" onClick={load} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        {loading && <p className="msg loading">Loading products...</p>}
        {!loading && products.length === 0 && (
          <div className="empty">No products yet. Add one with the form on the left.</div>
        )}
        <div className="user-grid">
          {products.map((p) => (
            <div className="user-card" key={p._id}>
              <h3>{p.name}</h3>
              {p.description && <p className="email">{p.description}</p>}
              <p className="age">Price: ${Number(p.price).toFixed(2)} · Stock: {p.stock ?? 0}</p>
              <div className="card-actions">
                <button className="btn small ghost" onClick={() => startEdit(p)}>Edit</button>
                <button className="btn small danger" onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
