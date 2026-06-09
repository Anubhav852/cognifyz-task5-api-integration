const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── In-memory storage ─────────────────────────────────────────────
let users = [
  { id: 1, name: 'Anubhav VK',    email: 'anubhav@system.io', role: 'Admin' },
  { id: 2, name: 'John Doe',      email: 'john@system.io',    role: 'Editor' },
  { id: 3, name: 'Jane Smith',    email: 'jane@system.io',    role: 'Viewer' },
];
let nextId = 4;

// ── Routes ────────────────────────────────────────────────────────

// GET all users
app.get('/api/users', (req, res) => {
  res.json({ success: true, count: users.length, data: users });
});

// GET user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

// POST create user
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email and role are required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }
  const user = { id: nextId++, name, email, role };
  users.push(user);
  res.status(201).json({ success: true, data: user });
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email and role are required' });
  }
  users[index] = { ...users[index], name, email, role };
  res.json({ success: true, data: users[index] });
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });
  const deleted = users.splice(index, 1);
  res.json({ success: true, data: deleted[0] });
});

// ── Serve frontend ────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});