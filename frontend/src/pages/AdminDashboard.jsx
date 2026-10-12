import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';
import StudentDetailsModal from '../components/StudentDetailsModal';

export default function AdminDashboard() {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState((location.state && location.state.notice) || '');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api('/admin/students')
      .then(setStudents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => ({
    total: students.length,
    pending: students.filter((s) => s.admissionStatus === 'pending').length,
    accepted: students.filter((s) => s.admissionStatus === 'accepted').length,
    rejected: students.filter((s) => s.admissionStatus === 'rejected').length,
  }), [students]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const statusOk = statusFilter === 'all' || s.admissionStatus === statusFilter;
      const searchOk =
        !q || [s.name, s.username, s.email, s.course, s.phone].some((v) => String(v).toLowerCase().includes(q));
      return statusOk && searchOk;
    });
  }, [students, search, statusFilter]);

  async function changeStatus(student, status) {
    setError('');
    setNotice('');
    try {
      const updated = await api(`/admin/students/${student.id}/admission`, {
        method: 'PATCH',
        body: { status },
      });
      setStudents((list) => list.map((s) => (s.id === updated.id ? updated : s)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete ${student.name} (${student.username})? This cannot be undone.`)) return;
    setError('');
    try {
      await api(`/admin/students/${student.id}`, { method: 'DELETE' });
      setStudents((list) => list.filter((s) => s.id !== student.id));
      setNotice('Student deleted.');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="card card-wide">
      <div className="page-head">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/students/new" className="btn btn-small btn-link">+ Add Student</Link>
      </div>

      <div className="stats">
        <div className="stat"><span>{counts.total}</span>Total</div>
        <div className="stat stat-pending"><span>{counts.pending}</span>Pending</div>
        <div className="stat stat-accepted"><span>{counts.accepted}</span>Accepted</div>
        <div className="stat stat-rejected"><span>{counts.rejected}</span>Rejected</div>
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <input placeholder="Search name, username, email, course, phone..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading students...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">No students found.</p>
      ) : (
        <div className="table-wrap">
          <table className="list">
            <thead>
              <tr>
                <th>#</th><th>Username</th><th>Name</th><th>Course</th><th>Sem</th>
                <th>Email</th><th>Phone</th><th>Status</th><th>Admission</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td>{s.username}</td>
                  <td>{s.name}</td>
                  <td>{s.course}</td>
                  <td>{s.semester}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td><StatusBadge status={s.admissionStatus} /></td>
                  <td>
                    {s.admissionStatus === 'pending' ? (
                      <div className="btn-row">
                        <button className="btn btn-small btn-green" onClick={() => changeStatus(s, 'accepted')}>Accept</button>
                        <button className="btn btn-small btn-red" onClick={() => changeStatus(s, 'rejected')}>Reject</button>
                      </div>
                    ) : (
                      <label className="switch" title="Toggle admission status">
                        <input
                          type="checkbox"
                          checked={s.admissionStatus === 'accepted'}
                          onChange={() => changeStatus(s, s.admissionStatus === 'accepted' ? 'rejected' : 'accepted')}
                        />
                        <span className="slider" />
                      </label>
                    )}
                  </td>
                  <td>
                    <div className="btn-row">
                      <button className="btn btn-small btn-outline-small" onClick={() => setSelected(s)}>View</button>
                      <Link to={`/admin/students/${s.id}/edit`} className="btn btn-small btn-link">Edit</Link>
                      <button className="btn btn-small btn-red" onClick={() => handleDelete(s)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <StudentDetailsModal student={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}