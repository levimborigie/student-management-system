import { Link, useNavigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm';
import { api } from '../api';

export default function Register() {
  const navigate = useNavigate();

  async function handleRegister(form) {
    const data = await api('/auth/register', { method: 'POST', body: form });
    // Registration done -> login page, carrying the new username
    navigate('/login', { state: { registeredUsername: data.username } });
  }

  return (
    <div className="card">
      <h1>Student Registration</h1>
      <p className="subtitle">Fill in your details. Your username will be created for you.</p>
      <StudentForm onSubmit={handleRegister} submitLabel="Register" />
      <p className="switch">Already registered? <Link to="/login">Login here</Link></p>
    </div>
  );
}