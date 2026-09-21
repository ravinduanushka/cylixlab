import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // null | 'student' | 'parent'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Male',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setMessage(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        role: role,
      });

      setMessage(response.data?.message || 'Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Top navigation back button */}
      <Link to="/" className="register-home-link" aria-label="Back to home">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Home</span>
      </Link>

      <div className="register-container">
        {/* Step 1: Role Selection */}
        {!role && (
          <div className="role-selection-wrapper">
            <h1 className="register-main-title">Create your Account</h1>
            <p className="register-role-subtitle">Choose your role</p>

            <div className="role-button-group">
              <button
                type="button"
                className="btn-role btn-role-student"
                onClick={() => handleRoleSelect('student')}
              >
                Student
              </button>
              <button
                type="button"
                className="btn-role btn-role-parent"
                onClick={() => handleRoleSelect('parent')}
              >
                Parent
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Registration Form (Student or Parent) */}
        {role && (
          <div className="register-form-wrapper">
            <h1 className="register-role-header">
              {role === 'student' ? 'Student Registration' : 'Parent Registration'}
            </h1>

            {error && <div className="register-alert register-alert-error">{error}</div>}
            {message && <div className="register-alert register-alert-success">{message}</div>}

            <form onSubmit={handleSubmit} className="register-form" noValidate>
              <div className="register-form-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="name"
                    className="form-input-pill"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input-pill"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input-pill"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="gender"
                      name="gender"
                      className="form-input-pill form-select-pill"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <span className="select-arrow" aria-hidden="true">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="btn-signup"
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>

              {/* Back to role selection */}
              <div className="register-footer-links">
                <button
                  type="button"
                  className="btn-switch-role"
                  onClick={() => setRole(null)}
                >
                  &larr; Choose different role
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
