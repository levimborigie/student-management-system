const TOKEN_KEY = 'sms_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Calls the Express API. Throws an Error with .errors (field messages) on failure.
export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    /* empty response */
  }

  if (!res.ok) {
    // Expired / invalid session -> back to login
    if (res.status === 401 && token && path !== '/auth/login' && path !== '/auth/me') {
      clearToken();
      window.location.assign('/login');
    }
    const err = new Error((data && data.message) || 'Something went wrong. Please try again.');
    err.status = res.status;
    err.errors = (data && data.errors) || {};
    throw err;
  }
  return data;
}