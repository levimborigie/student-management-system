const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const store = require('./store');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const attempt = crypto.scryptSync(String(password), salt, 64);
  const original = Buffer.from(hash, 'hex');
  return attempt.length === original.length && crypto.timingSafeEqual(attempt, original);
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// First name (letters only, max 8) + 3 random digits, e.g. "levi753"
function generateUsername(fullName) {
  const first =
    String(fullName || '')
      .trim()
      .split(' ')[0]
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .slice(0, 8) || 'student';

  for (let i = 0; i < 20; i++) {
    const candidate = first + Math.floor(100 + Math.random() * 900);
    if (!store.findByUsername(candidate)) return candidate;
  }
  let candidate;
  do {
    candidate = first + Math.floor(1000 + Math.random() * 9000);
  } while (store.findByUsername(candidate));
  return candidate;
}

// Never send the password hash to the browser
function sanitize(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

function seedAdmin() {
  if (store.getAll().some((u) => u.role === 'admin')) return;

  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  store.add({
    id: crypto.randomUUID(),
    role: 'admin',
    username: 'admin',
    name: 'Administrator',
    email: 'admin@sms.local',
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  });
  console.log('Default admin created (username: admin, password: Admin@123). Change it before real use.');
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  generateUsername,
  sanitize,
  seedAdmin,
};