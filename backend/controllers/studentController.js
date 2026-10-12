const { validateStudentInput } = require('../utils/validators');
const { sanitize } = require('../utils/security');
const { duplicateErrors, updateStudentFields } = require('../utils/studentService');

function getMe(req, res) {
  res.json(sanitize(req.user));
}

// Students can edit everything except id, username and admission status
function updateMe(req, res) {
  const data = req.body || {};
  const errors = {
    ...validateStudentInput(data, { passwordRequired: false }),
    ...duplicateErrors(data, req.user.id),
  };

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  }

  const updated = updateStudentFields(req.user.id, data);
  res.json(sanitize(updated));
}

module.exports = { getMe, updateMe };