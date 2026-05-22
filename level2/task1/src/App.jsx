import { useCallback, useEffect, useState } from 'react';
import * as api from './api.js';
import UserForm from './components/UserForm.jsx';
import UserList from './components/UserList.jsx';
import './App.css';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.listUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.updateUser(editing._id, payload);
      } else {
        await api.createUser(payload);
      }
      setEditing(null);
      await loadUsers();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className="topbar">
        <h1>Users Dashboard (React)</h1>
        <p className="subtitle">Codveda Internship – Level 2 Task 1</p>
      </header>
      <main className="container">
        <section className="panel form-panel">
          <UserForm
            editing={editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitting={submitting}
          />
        </section>
        <UserList
          users={users}
          loading={loading}
          error={error}
          onEdit={setEditing}
          onDelete={handleDelete}
          onRefresh={loadUsers}
        />
      </main>
      <footer className="footer">
        <p>Kwadwo Wilson · Codveda Technology Internship</p>
      </footer>
    </>
  );
}
