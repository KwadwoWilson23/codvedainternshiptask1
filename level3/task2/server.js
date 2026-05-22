const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));

const users = new Map();

function broadcastOnline() {
  io.emit('users:online', Array.from(users.values()));
}

io.on('connection', (socket) => {
  socket.on('user:join', (username) => {
    const clean = (username || '').trim().slice(0, 30) || 'Anonymous';
    users.set(socket.id, clean);
    socket.broadcast.emit('system', { text: `${clean} joined the chat` });
    broadcastOnline();
  });

  socket.on('message:send', (text) => {
    const username = users.get(socket.id);
    if (!username) return;
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    io.emit('message:new', {
      id: `${Date.now()}-${socket.id}`,
      username,
      text: trimmed.slice(0, 500),
      at: new Date().toISOString()
    });
  });

  socket.on('typing', (isTyping) => {
    const username = users.get(socket.id);
    if (!username) return;
    socket.broadcast.emit('typing', { username, isTyping: Boolean(isTyping) });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      socket.broadcast.emit('system', { text: `${username} left the chat` });
      broadcastOnline();
    }
  });
});

const PORT = process.env.PORT || 5004;
server.listen(PORT, () => console.log(`Chat server running on http://localhost:${PORT}`));
