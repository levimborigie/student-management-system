import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registeredUsername = location.state && location.state.registeredUsername;

  const [form, setForm] = useState({ username: registeredUsername || '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError('');
    try {
      const user = await login(form.username.trim(), form.password);
      navigate(user.role === 'admin' ? '/admin' : '/student', { replace: true });
    } catch (err) {
      const hasFieldErrors = err.errors && Object.keys(err.errors).length > 0;
      setErrors(err.errors || {});
      setFormError(hasFieldErrors ? '' : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card card-small">
      <h1>Login</h1>

      {registeredUsername && (
        <div className="alert alert-success">
          Registration successful! Your username is <strong className="username">{registeredUsername}</strong>.
          Login with it and the password you just created.
        </div>
      )}
      {formError && <div className="alert alert-error">{formError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={`field ${errors.username ? 'has-error' : ''}`}>
          <label htmlFor="username">Username</label>
          <input id="username" value={form.username} autoComplete="username"
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className={`field ${errors.password ? 'has-error' : ''}`}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} autoComplete="current-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn" disabled={busy}>{busy ? 'Please wait...' : 'Login'}</button>
      </form>

      <p className="switch">New student? <Link to="/register">Register here</Link></p>
    </div>
  );
}