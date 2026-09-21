const Navbar = () => {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-logo">
          <a href="#home">CylixLab</a>
        </div>
        <nav className="navbar-links">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#plan" className="nav-link">Plan</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About Us</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
