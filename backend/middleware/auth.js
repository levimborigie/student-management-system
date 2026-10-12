const store = require('../utils/store');
const { verifyToken } = require('../utils/security');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });

  try {
    const payload = verifyToken(token);
    const user = store.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Account no longer exists.' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Session expired. Please login again.' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: 'Access denied.' });
    next();
  };
}

module.exports = { authenticate, requireRole };