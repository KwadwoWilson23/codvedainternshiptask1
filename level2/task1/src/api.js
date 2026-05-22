const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;
  if (!res.ok) {
    const message = body?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return body;
}

export const listUsers = () => request('/users');
export const getUser = (id) => request(`/users/${id}`);
export const createUser = (data) => request('/users', { method: 'POST', body: JSON.stringify(data) });
export const updateUser = (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });
