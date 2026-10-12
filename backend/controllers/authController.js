const store = require('../utils/store');
const { validateStudentInput } = require('../utils/validators');
const { verifyPassword, signToken, sanitize } = require('../utils/security');
const { createStudent, duplicateErrors } = require('../utils/studentService');

function register(req, res) {
  const data = req.body || {};
  const errors = {
    ...validateStudentInput(data, { passwordRequired: true }),
    ...duplicateErrors(data, null),
  };

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  }

  const student = createStudent(data);
  res.status(201).json({ message: 'Registration successful.', username: student.username });
}

function login(req, res) {
  const username = String((req.body && req.body.username) || '').trim().toLowerCase();
  const password = String((req.body && req.body.password) || '');
  const errors = {};

  if (!username) errors.username = 'Username is required.';
  if (!password) errors.password = 'Password is required.';
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  }

  // Same message for unknown user and wrong password
  const user = store.findByUsername(username);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  res.json({ token: signToken(user), user: sanitize(user) });
}

function me(req, res) {
  res.json(sanitize(req.user));
}

module.exports = { register, login, me };