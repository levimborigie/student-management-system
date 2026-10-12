import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudentForm from './pages/AdminStudentForm';

const homeFor = (user) => (user.role === 'admin' ? '/admin' : '/student');

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Loading...</p>;
  return <Navigate to={user ? homeFor(user) : '/login'} replace />;
}

// Login/Register are hidden once logged in
function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Loading...</p>;
  if (user) return <Navigate to={homeFor(user)} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />

          <Route
            path="/student"
            element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}
          />

          <Route
            path="/admin"
            element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/students/new"
            element={<ProtectedRoute role="admin"><AdminStudentForm /></ProtectedRoute>}
          />
          <Route
            path="/admin/students/:id/edit"
            element={<ProtectedRoute role="admin"><AdminStudentForm /></ProtectedRoute>}
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}