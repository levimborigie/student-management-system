const crypto = require('crypto');
const store = require('./store');
const { validateEmail, validatePhone } = require('./validators');
const { hashPassword, generateUsername } = require('./security');

// Only these fields can ever be written from a request body.
// id, role, username and admissionStatus are deliberately NOT in this list.
function clean(d) {
  return {
    name: String(d.name || '').trim(),
    dob: String(d.dob || '').trim(),
    course: String(d.course || '').trim(),
    gender: String(d.gender || '').trim().toUpperCase(),
    email: String(d.email || '').trim().toLowerCase(),
    semester: Number(d.semester),
    phone: String(d.phone || '').trim(),
    address: String(d.address || '').trim(),
  };
}

// Duplicate email/phone (ignoring the student being edited)
function duplicateErrors(data, exceptId) {
  const errors = {};
  if (!validateEmail(data.email) && store.findByEmail(data.email, exceptId)) {
    errors.email = 'This email is already registered.';
  }
  if (!validatePhone(data.phone) && store.findByPhone(data.phone, exceptId)) {
    errors.phone = 'This phone number is already registered.';
  }
  return errors;
}

function createStudent(data) {
  const fields = clean(data);
  return store.add({
    id: crypto.randomUUID(),
    role: 'student',
    username: generateUsername(fields.name),
    ...fields,
    admissionStatus: 'pending',
    passwordHash: hashPassword(data.password),
    createdAt: new Date().toISOString(),
  });
}

function updateStudentFields(id, data) {
  const patch = clean(data);
  if (String(data.password || '') !== '') patch.passwordHash = hashPassword(data.password);
  return store.update(id, patch);
}

module.exports = { duplicateErrors, createStudent, updateStudentFields };