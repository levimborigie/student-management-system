import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="topbar">
      <Link to="/" className="brand">Student Management System</Link>
      {user && (
        <div className="nav-right">
          <span>
            {user.name} <em className="role">({user.role})</em>
          </span>
          <button className="btn btn-small btn-light" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}