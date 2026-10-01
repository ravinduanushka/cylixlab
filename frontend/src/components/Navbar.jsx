import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/">CylixLab</Link>
        </div>
        <nav className="navbar-links">
          <a href="/#home" className="nav-link active">Home</a>
          <a href="/#plan" className="nav-link">Plan</a>
          <a href="/#features" className="nav-link">Features</a>
          <Link to="/parent-dashboard" className="nav-link">Parent Dashboard</Link>
          <Link to="/student-dashboard" className="nav-link">Student Dashboard</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
