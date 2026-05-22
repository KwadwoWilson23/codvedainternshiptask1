const socket = io();

const joinScreen = document.getElementById('join-screen');
const chatScreen = document.getElementById('chat-screen');
const joinForm = document.getElementById('join-form');
const usernameInput = document.getElementById('username-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesEl = document.getElementById('messages');
const onlineList = document.getElementById('online-list');
const onlineCount = document.getElementById('online-count');
const typingEl = document.getElementById('typing-indicator');
const leaveBtn = document.getElementById('leave-btn');

let myUsername = '';
let typingTimeout = null;
const typingUsers = new Set();

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage({ username, text, at }, mine) {
  const div = document.createElement('div');
  div.className = 'bubble ' + (mine ? 'mine' : 'theirs');
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = `${username} · ${formatTime(at)}`;
  const body = document.createElement('div');
  body.textContent = text;
  div.appendChild(meta);
  div.appendChild(body);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function appendSystem(text) {
  const div = document.createElement('div');
  div.className = 'bubble system';
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderOnline(list) {
  onlineList.innerHTML = '';
  list.forEach((name) => {
    const li = document.createElement('li');
    li.textContent = name + (name === myUsername ? ' (you)' : '');
    onlineList.appendChild(li);
  });
  onlineCount.textContent = `(${list.length})`;
}

function renderTyping() {
  const others = Array.from(typingUsers).filter((u) => u !== myUsername);
  if (others.length === 0) {
    typingEl.textContent = '';
  } else if (others.length === 1) {
    typingEl.textContent = `${others[0]} is typing...`;
  } else {
    typingEl.textContent = `${others.length} people are typing...`;
  }
}

joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = usernameInput.value.trim();
  if (!name) return;
  myUsername = name;
  socket.emit('user:join', name);
  joinScreen.hidden = true;
  chatScreen.hidden = false;
  messageInput.focus();
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value;
  if (!text.trim()) return;
  socket.emit('message:send', text);
  messageInput.value = '';
  socket.emit('typing', false);
});

messageInput.addEventListener('input', () => {
  socket.emit('typing', messageInput.value.length > 0);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => socket.emit('typing', false), 1500);
});

leaveBtn.addEventListener('click', () => {
  socket.disconnect();
  location.reload();
});

socket.on('message:new', (msg) => {
  appendMessage(msg, msg.username === myUsername);
});

socket.on('system', ({ text }) => {
  appendSystem(text);
});

socket.on('users:online', (list) => {
  renderOnline(list);
});

socket.on('typing', ({ username, isTyping }) => {
  if (isTyping) typingUsers.add(username);
  else typingUsers.delete(username);
  renderTyping();
});

socket.on('disconnect', () => {
  appendSystem('You have been disconnected.');
});
