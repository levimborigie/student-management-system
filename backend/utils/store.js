const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readAll() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveAll(list) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

const norm = (v) => String(v || '').trim().toLowerCase();

function getAll() {
  return readAll();
}

function findById(id) {
  return readAll().find((u) => u.id === id) || null;
}

function findByUsername(username) {
  const u = norm(username);
  return readAll().find((x) => x.username === u) || null;
}

function findByEmail(email, exceptId) {
  const e = norm(email);
  return readAll().find((u) => u.email === e && u.id !== exceptId) || null;
}

function findByPhone(phone, exceptId) {
  const p = String(phone || '').trim();
  return readAll().find((u) => u.phone === p && u.id !== exceptId) || null;
}

function add(user) {
  const all = readAll();
  all.push(user);
  saveAll(all);
  return user;
}

function update(id, patch) {
  const all = readAll();
  const i = all.findIndex((u) => u.id === id);
  if (i === -1) return null;
  all[i] = { ...all[i], ...patch, updatedAt: new Date().toISOString() };
  saveAll(all);
  return all[i];
}

function remove(id) {
  const all = readAll();
  const next = all.filter((u) => u.id !== id);
  if (next.length === all.length) return false;
  saveAll(next);
  return true;
}

module.exports = { getAll, findById, findByUsername, findByEmail, findByPhone, add, update, remove };