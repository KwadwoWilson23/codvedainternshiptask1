import { useEffect, useState } from 'react';

const empty = { name: '', email: '', age: '' };

export default function UserForm({ editing, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setValues({
        name: editing.name || '',
        email: editing.email || '',
        age: editing.age != null ? String(editing.age) : ''
      });
    } else {
      setValues(empty);
    }
    setError('');
  }, [editing]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!values.name.trim() || !values.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    const payload = { name: values.name.trim(), email: values.email.trim() };
    if (values.age !== '') payload.age = Number(values.age);
    try {
      await onSubmit(payload);
      if (!editing) setValues(empty);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>{editing ? 'Edit User' : 'Add New User'}</h2>
      <label>
        Name
        <input name="name" value={values.name} onChange={handleChange} required minLength={2} maxLength={80} />
      </label>
      <label>
        Email
        <input name="email" type="email" value={values.email} onChange={handleChange} required />
      </label>
      <label>
        Age
        <input name="age" type="number" min={0} max={130} value={values.age} onChange={handleChange} />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button type="button" className="btn ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
      {error && <p className="msg error">{error}</p>}
    </form>
  );
}
