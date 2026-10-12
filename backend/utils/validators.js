const MIN_AGE = 16;
const MAX_AGE = 100;
const ADMISSION_STATUSES = ['pending', 'accepted', 'rejected'];

function validateName(value) {
  const v = String(value || '').trim();
  if (!v) return 'Name is required.';
  if (v.length < 2) return 'Name must be at least 2 letters.';
  if (v.length > 60) return 'Name must not be longer than 60 characters.';
  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v)) {
    return 'Name can contain alphabets only (no numbers or special characters).';
  }
  return null;
}

// Expects "YYYY-MM-DD" from <input type="date">
function validateDob(value) {
  const v = String(value || '').trim();
  if (!v) return 'Date of birth is required.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Date of birth must be in YYYY-MM-DD format.';

  const [y, m, d] = v.split('-').map(Number);
  const dob = new Date(y, m - 1, d);

  if (dob.getFullYear() !== y || dob.getMonth() !== m - 1 || dob.getDate() !== d) {
    return 'Date of birth is not a valid calendar date.';
  }

  const today = new Date();
  if (dob > today) return 'Date of birth cannot be in the future.';

  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthday =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthday) age -= 1;

  if (age < MIN_AGE) return `Student must be at least ${MIN_AGE} years old.`;
  if (age > MAX_AGE) return 'Please enter a realistic date of birth.';
  return null;
}

function validateCourse(value) {
  const v = String(value || '').trim();
  if (!v) return 'Course is required.';
  if (v.length < 2) return 'Course name is too short.';
  if (v.length > 100) return 'Course name must not be longer than 100 characters.';
  if (!/^[A-Za-z0-9 .&()\-]+$/.test(v)) return 'Course contains invalid characters.';
  return null;
}

function validateGender(value) {
  const v = String(value || '').trim().toUpperCase();
  if (!v) return 'Gender is required.';
  if (v !== 'M' && v !== 'F') return 'Gender must be M or F only.';
  return null;
}

function validateEmail(value) {
  const v = String(value || '').trim();
  if (!v) return 'Email is required.';
  if (v.length > 254) return 'Email is too long.';
  if (/\s/.test(v)) return 'Email must not contain spaces.';
  if (!/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/.test(v)) {
    return 'Enter a valid email address (e.g. name@example.com).';
  }
  return null;
}

function validateSemester(value) {
  const v = String(value || '').trim();
  if (!v) return 'Semester is required.';
  if (!/^\d+$/.test(v)) return 'Semester must be a whole number.';
  const n = Number(v);
  if (n < 1 || n > 8) return 'Semester must be between 1 and 8.';
  return null;
}

function validatePhone(value) {
  const v = String(value || '').trim();
  if (!v) return 'Phone number is required.';
  if (!/^\d+$/.test(v)) return 'Phone number must contain digits only.';
  if (v.length !== 10) return 'Phone number must be exactly 10 digits.';
  return null;
}

function validateAddress(value) {
  const v = String(value || '').trim();
  if (!v) return 'Address is required.';
  if (v.length < 5) return 'Address is too short (minimum 5 characters).';
  if (v.length > 200) return 'Address must not be longer than 200 characters.';
  return null;
}

function validatePassword(value) {
  const v = String(value || '');
  if (!v) return 'Password is required.';
  if (v.length < 8) return 'Password must be at least 8 characters.';
  if (v.length > 64) return 'Password must not be longer than 64 characters.';
  if (/\s/.test(v)) return 'Password must not contain spaces.';
  if (!/[a-z]/.test(v)) return 'Password must include a lowercase letter.';
  if (!/[A-Z]/.test(v)) return 'Password must include an uppercase letter.';
  if (!/\d/.test(v)) return 'Password must include a number.';
  if (!/[^A-Za-z0-9]/.test(v)) return 'Password must include a special character (e.g. @, #, !).';
  return null;
}

function validatePasswordConfirm(password, confirm) {
  const c = String(confirm || '');
  if (!c) return 'Please confirm your password.';
  if (String(password || '') !== c) return 'Passwords do not match.';
  return null;
}

function validateAdmissionStatus(value) {
  return ADMISSION_STATUSES.includes(value)
    ? null
    : 'Status must be pending, accepted or rejected.';
}

// passwordRequired: true for register/create. For edits the password is optional,
// but if one is typed it is fully validated and must be confirmed.
function validateStudentInput(data, { passwordRequired }) {
  const d = data || {};
  const checks = {
    name: validateName(d.name),
    dob: validateDob(d.dob),
    course: validateCourse(d.course),
    gender: validateGender(d.gender),
    email: validateEmail(d.email),
    semester: validateSemester(d.semester),
    phone: validatePhone(d.phone),
    address: validateAddress(d.address),
  };

  if (passwordRequired || String(d.password || '') !== '') {
    checks.password = validatePassword(d.password);
    checks.confirmPassword = validatePasswordConfirm(d.password, d.confirmPassword);
  }

  const errors = {};
  Object.keys(checks).forEach((field) => {
    if (checks[field]) errors[field] = checks[field];
  });
  return errors;
}

module.exports = {
  validateEmail,
  validatePhone,
  validateAdmissionStatus,
  validateStudentInput,
};