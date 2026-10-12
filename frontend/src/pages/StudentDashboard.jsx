import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import StudentForm from '../components/StudentForm';
import StatusBadge from '../components/StatusBadge';

const STATUS_TEXT = {
  pending: 'Your admission request is waiting for the admin to review.',
  accepted: 'Congratulations! Your admission has been accepted.',
  rejected: 'Your admission request was rejected. Please contact the administration.',
};

export default function StudentDashboard() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSave(form) {
    const updated = await api('/student/me', { method: 'PUT', body: form });
    setUser(updated);
    setMessage('Profile updated successfully.');
    setEditing(false);
  }

  const rows = [
    ['Student ID', user.id],
    ['Username', user.username],
    ['Full Name', user.name],
    ['Date of Birth', user.dob],
    ['Gender', user.gender],
    ['Course', user.course],
    ['Semester', user.semester],
    ['Email', user.email],
    ['Phone', user.phone],
    ['Address', user.address],
  ];

  return (
    <div className="card">
      <h1>Welcome, {user.name}</h1>

      <div className={`alert alert-status-${user.admissionStatus}`}>
        <strong>Admission status: </strong>
        <StatusBadge status={user.admissionStatus} />
        <div className="status-text">{STATUS_TEXT[user.admissionStatus]}</div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {editing ? (
        <>
          <h2>Edit Profile</h2>
          <p className="subtitle">Student ID, username and admission status cannot be changed.</p>
          <StudentForm
            initial={{ ...user, semester: String(user.semester) }}
            onSubmit={handleSave}
            submitLabel="Save Changes"
            passwordOptional
          />
          <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <table className="profile">
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label}><th>{label}</th><td>{value}</td></tr>
              ))}
            </tbody>
          </table>
          <button className="btn" onClick={() => { setMessage(''); setEditing(true); }}>Edit Profile</button>
        </>
      )}
    </div>
  );
}