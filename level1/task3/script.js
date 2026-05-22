const API_BASE = 'http://localhost:5000';

const form = document.getElementById('user-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const refreshBtn = document.getElementById('refresh-btn');
const userIdInput = document.getElementById('user-id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const formMsg = document.getElementById('form-msg');
const listStatus = document.getElementById('list-status');
const userGrid = document.getElementById('user-grid');

function setStatus(el, text, type) {
  el.textContent = text || '';
  el.className = 'msg' + (type ? ' ' + type : '');
}

function resetForm() {
  form.reset();
  userIdInput.value = '';
  formTitle.textContent = 'Add New User';
  submitBtn.textContent = 'Create';
  cancelBtn.hidden = true;
  setStatus(formMsg, '');
}

async function apiRequest(path, options = {}) {
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

async function loadUsers() {
  setStatus(listStatus, 'Loading users...', 'loading');
  userGrid.innerHTML = '';
  try {
    const users = await apiRequest('/users');
    renderUsers(users);
    setStatus(listStatus, `${users.length} user(s) loaded.`, 'success');
  } catch (err) {
    setStatus(listStatus, `Error: ${err.message}`, 'error');
  }
}

function renderUsers(users) {
  if (!users.length) {
    userGrid.innerHTML = '<div class="empty">No users yet. Add one with the form on the left.</div>';
    return;
  }
  userGrid.innerHTML = '';
  users.forEach((u) => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <h3></h3>
      <p class="email"></p>
      <p class="age"></p>
      <div class="card-actions">
        <button class="btn small ghost" data-action="edit">Edit</button>
        <button class="btn small danger" data-action="delete">Delete</button>
      </div>
    `;
    card.querySelector('h3').textContent = u.name;
    card.querySelector('.email').textContent = u.email;
    card.querySelector('.age').textContent = u.age != null ? `Age: ${u.age}` : 'Age: —';
    card.querySelector('[data-action="edit"]').addEventListener('click', () => startEdit(u));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteUser(u._id));
    userGrid.appendChild(card);
  });
}

function startEdit(user) {
  userIdInput.value = user._id;
  nameInput.value = user.name || '';
  emailInput.value = user.email || '';
  ageInput.value = user.age != null ? user.age : '';
  formTitle.textContent = 'Edit User';
  submitBtn.textContent = 'Update';
  cancelBtn.hidden = false;
  setStatus(formMsg, '');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  setStatus(listStatus, 'Deleting...', 'loading');
  try {
    await apiRequest(`/users/${id}`, { method: 'DELETE' });
    await loadUsers();
  } catch (err) {
    setStatus(listStatus, `Error: ${err.message}`, 'error');
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = userIdInput.value.trim();
  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim()
  };
  const ageVal = ageInput.value.trim();
  if (ageVal !== '') payload.age = Number(ageVal);

  if (!payload.name || !payload.email) {
    setStatus(formMsg, 'Name and email are required.', 'error');
    return;
  }

  setStatus(formMsg, id ? 'Updating...' : 'Creating...', 'loading');
  try {
    if (id) {
      await apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setStatus(formMsg, 'User updated.', 'success');
    } else {
      await apiRequest('/users', { method: 'POST', body: JSON.stringify(payload) });
      setStatus(formMsg, 'User created.', 'success');
    }
    resetForm();
    await loadUsers();
  } catch (err) {
    setStatus(formMsg, `Error: ${err.message}`, 'error');
  }
});

cancelBtn.addEventListener('click', resetForm);
refreshBtn.addEventListener('click', loadUsers);

loadUsers();
