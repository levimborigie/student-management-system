import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StudentForm from '../components/StudentForm';
import { api } from '../api';

// Used for both /admin/students/new (create) and /admin/students/:id/edit (update)
export default function AdminStudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [initial, setInitial] = useState(isEdit ? null : {});
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api(`/admin/students/${id}`)
      .then((s) => setInitial({ ...s, semester: String(s.semester) }))
      .catch((e) => setLoadError(e.message));
  }, [id, isEdit]);

  async function handleSubmit(form) {
    if (isEdit) {
      await api(`/admin/students/${id}`, { method: 'PUT', body: form });
      navigate('/admin', { state: { notice: 'Student updated successfully.' } });
    } else {
      const created = await api('/admin/students', { method: 'POST', body: form });
      navigate('/admin', { state: { notice: `Student created. Username: ${created.username}` } });
    }
  }

  return (
    <div className="card">
      <h1>{isEdit ? 'Edit Student' : 'Add Student'}</h1>
      <p className="subtitle">
        {isEdit ? 'Leave the password blank to keep the current one.' : 'A username is generated automatically.'}
      </p>

      {loadError && <div className="alert alert-error">{loadError}</div>}
      {initial && (
        <StudentForm
          initial={initial}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? 'Save Changes' : 'Create Student'}
          passwordOptional={isEdit}
        />
      )}

      <p className="switch"><Link to="/admin">&larr; Back to dashboard</Link></p>
    </div>
  );
}