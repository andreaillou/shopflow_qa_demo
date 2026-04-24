const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { users, sessions, toPublicUser } = require('../data/seed');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existing = users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = {
    id: uuidv4(),
    email: String(email),
    password: String(password),
    role: 'user',
    created_at: new Date().toISOString(),
  };

  users.push(user);

  const token = uuidv4();
  sessions[token] = user.id;

  return res.status(201).json({ user: toPublicUser(user), token });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  const user = users.find((candidate) => candidate.email.toLowerCase() === String(email || '').toLowerCase());

  // BUG-001: keep one generic message for both unknown email and wrong password.
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = uuidv4();
  sessions[token] = user.id;

  return res.status(200).json({ user: toPublicUser(user), token });
});

router.post('/logout', requireAuth, (req, res) => {
  delete sessions[req.token];
  return res.status(204).send();
});

module.exports = router;
