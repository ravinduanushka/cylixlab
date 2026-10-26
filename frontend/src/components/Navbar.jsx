import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('lastRegisteredRole');
        if (token && role) {
          setCurrentUser({ role });
        }
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cylixlab_assignments_data');
      localStorage.removeItem('cylixlab_parent_progress_data');
    } catch {}
    setCurrentUser(null);
    navigate('/');
  };

  const getDashboardInfo = () => {
    if (!currentUser) return null;
    const role = currentUser.role || localStorage.getItem('lastRegisteredRole');
    if (role === 'parent') {
      return { to: '/parent-dashboard', label: 'Parent Dashboard' };
    }
    if (role === 'admin') {
      return { to: '/admin-dashboard', label: 'Admin Dashboard' };
    }
    if (role === 'student') {
      return { to: '/student-dashboard', label: 'Student Dashboard' };
    }
    return null;
  };

  const dashboardInfo = getDashboardInfo();

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/">CylixLab</Link>
        </div>
        <nav className="navbar-links">
          <a
            href="#home"
            className="nav-link active"
            onClick={(e) => scrollToSection(e, 'home')}
          >
            Home
          </a>
          <a
            href="#plan"
            className="nav-link"
            onClick={(e) => scrollToSection(e, 'plan')}
          >
            Plan
          </a>
          <a
            href="#features"
            className="nav-link"
            onClick={(e) => scrollToSection(e, 'features')}
          >
            Features
          </a>
          <a
            href="#about"
            className="nav-link"
            onClick={(e) => scrollToSection(e, 'about')}
          >
            About us
          </a>
          {dashboardInfo && (
            <>
              <Link to={dashboardInfo.to} className="nav-link">
                {dashboardInfo.label}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="nav-link navbar-logout-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  font: 'inherit',
                  padding: '4px 6px',
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
