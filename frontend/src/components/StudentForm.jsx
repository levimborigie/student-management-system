import { useState } from 'react';

const EMPTY = {
  name: '', dob: '', course: '', gender: '', email: '',
  semester: '', phone: '', address: '', password: '', confirmPassword: '',
};

// Defined outside StudentForm so inputs don't lose focus while typing
function Field({ label, name, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Shared by Register, Admin create/edit and Student edit-profile.
// Validation messages come from the server (one message per field).
export default function StudentForm({ initial = {}, onSubmit, submitLabel, passwordOptional = false }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial, password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    setErrors({});
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors(err.errors || {});
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const passHint = passwordOptional ? 'Leave blank to keep current password' : 'Min 8 chars, upper, lower, number, symbol';

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <div className="alert alert-error">{formError}</div>}

      {initial.username && (
        <Field label="Username (cannot be changed)" name="username">
          <input id="username" value={initial.username} disabled />
        </Field>
      )}

      <Field label="Full Name" name="name" error={errors.name}>
        <input id="name" maxLength={60} value={form.name} placeholder="Alphabets only"
          onChange={(e) => set('name', e.target.value)} />
      </Field>

      <Field label="Date of Birth" name="dob" error={errors.dob}>
        <input id="dob" type="date" max={today} value={form.dob}
          onChange={(e) => set('dob', e.target.value)} />
      </Field>

      <Field label="Course" name="course" error={errors.course}>
        <input id="course" maxLength={100} value={form.course} placeholder="e.g. B.Sc Computer Science"
          onChange={(e) => set('course', e.target.value)} />
      </Field>

      <Field label="Gender" name="gender" error={errors.gender}>
        <div className="radio-group">
          {['M', 'F'].map((g) => (
            <label key={g}>
              <input type="radio" name="gender" value={g} checked={form.gender === g}
                onChange={() => set('gender', g)} /> {g}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Semester" name="semester" error={errors.semester}>
        <select id="semester" value={String(form.semester)} onChange={(e) => set('semester', e.target.value)}>
          <option value="">-- Select semester --</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={String(n)}>Semester {n}</option>
          ))}
        </select>
      </Field>

      <Field label="Email" name="email" error={errors.email}>
        <input id="email" type="email" maxLength={254} value={form.email} placeholder="name@example.com"
          onChange={(e) => set('email', e.target.value)} />
      </Field>

      <Field label="Phone" name="phone" error={errors.phone}>
        <input id="phone" inputMode="numeric" maxLength={10} value={form.phone} placeholder="10 digits"
          onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} />
      </Field>

      <Field label="Address" name="address" error={errors.address}>
        <textarea id="address" rows={3} maxLength={200} value={form.address}
          onChange={(e) => set('address', e.target.value)} />
      </Field>

      <Field label={passwordOptional ? 'New Password (optional)' : 'Password'} name="password" error={errors.password}>
        <input id="password" type="password" maxLength={64} value={form.password} placeholder={passHint}
          autoComplete="new-password" onChange={(e) => set('password', e.target.value)} />
      </Field>

      <Field label="Confirm Password" name="confirmPassword" error={errors.confirmPassword}>
        <input id="confirmPassword" type="password" maxLength={64} value={form.confirmPassword}
          autoComplete="new-password" onChange={(e) => set('confirmPassword', e.target.value)} />
      </Field>

      <button type="submit" className="btn" disabled={busy}>
        {busy ? 'Please wait...' : submitLabel}
      </button>
    </form>
  );
}