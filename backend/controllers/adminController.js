const store = require('../utils/store');
const { validateStudentInput, validateAdmissionStatus } = require('../utils/validators');
const { sanitize } = require('../utils/security');
const { createStudent, updateStudentFields, duplicateErrors } = require('../utils/studentService');

function findStudent(id) {
  const user = store.findById(id);
  return user && user.role === 'student' ? user : null;
}

// READ (all)
function listStudents(req, res) {
  const students = store
    .getAll()
    .filter((u) => u.role === 'student')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(sanitize);
  res.json(students);
}

// READ (one)
function getOne(req, res) {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found.' });
  res.json(sanitize(student));
}

// CREATE
function create(req, res) {
  const data = req.body || {};
  const errors = {
    ...validateStudentInput(data, { passwordRequired: true }),
    ...duplicateErrors(data, null),
  };
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  }
  res.status(201).json(sanitize(createStudent(data)));
}

// UPDATE (password optional)
function update(req, res) {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found.' });

  const data = req.body || {};
  const errors = {
    ...validateStudentInput(data, { passwordRequired: false }),
    ...duplicateErrors(data, student.id),
  };
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  }
  res.json(sanitize(updateStudentFields(student.id, data)));
}

// DELETE
function remove(req, res) {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found.' });
  store.remove(student.id);
  res.json({ message: 'Student deleted.' });
}

// ACCEPT / REJECT / TOGGLE admission
function setAdmission(req, res) {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found.' });

  const status = req.body && req.body.status;
  const error = validateAdmissionStatus(status);
  if (error) return res.status(400).json({ message: error });

  res.json(sanitize(store.update(student.id, { admissionStatus: status })));
}

module.exports = { listStudents, getOne, create, update, remove, setAdmission };