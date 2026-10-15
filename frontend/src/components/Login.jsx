import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleIcon } from './Icons';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: localStorage.getItem('lastRegisteredEmail') || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // If already logged in, automatically navigate to the correct dashboard
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        const role = user.role || localStorage.getItem('lastRegisteredRole');
        if (role === 'parent') {
          navigate('/parent-dashboard', { replace: true });
        } else if (role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else if (role === 'student') {
          navigate('/student-dashboard', { replace: true });
        }
      }
    } catch {
      // fallback
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Google sign in directly loads previous registered email and signs in
  const handleGoogleSignIn = async () => {
    setError(null);
    setMessage(null);

    const targetEmail = (formData.email || localStorage.getItem('lastRegisteredEmail') || '').trim();

    if (!targetEmail) {
      setError('Please enter your email above to continue with Google.');
      return;
    }

    const targetName = localStorage.getItem('lastRegisteredName') || targetEmail.split('@')[0];
    const targetRole = localStorage.getItem('lastRegisteredRole') || 'student';

    setGoogleLoading(true);
    try {
      const response = await axios.post('/api/auth/google', {
        email: targetEmail,
        name: targetName,
        role: targetRole,
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      const userObj = response.data?.user;
      const userRole = userObj?.role || targetRole;

      setMessage(response.data?.message || 'Login successful! Redirecting...');
      setTimeout(() => {
        if (userRole === 'parent') {
          navigate('/parent-dashboard');
        } else if (userRole === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/');
        }
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Google sign-in failed. Please try again.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      const loggedUser = response.data?.user;
      const loggedRole = loggedUser?.role || localStorage.getItem('lastRegisteredRole');

      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        if (loggedRole === 'parent') {
          navigate('/parent-dashboard');
        } else if (loggedRole === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/');
        }
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Top navigation back button */}
      <Link to="/" className="register-home-link" aria-label="Back to home">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Home</span>
      </Link>

      <div className="register-container">
        <div className="register-form-wrapper login-form-wrapper">
          <h1 className="register-role-header">Log in to your Account</h1>

          {error && <div className="register-alert register-alert-error">{error}</div>}
          {message && <div className="register-alert register-alert-success">{message}</div>}

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            {/* 1. Email Field */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                className="form-input-pill"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* 2. Password Field */}
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="login-password"
                name="password"
                className="form-input-pill"
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Actions: Log In Button, Divider, Google Sign In, & Sign Up Prompt */}
            <div className="register-actions-group">
              <button
                type="submit"
                className="btn-signup"
                disabled={loading || googleLoading}
              >
                {loading ? 'Logging In...' : 'Log In'}
              </button>

              <div className="auth-divider">
                <span className="auth-divider-line"></span>
                <span className="auth-divider-text">or</span>
                <span className="auth-divider-line"></span>
              </div>

              <button
                type="button"
                className="btn-google-signin"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
              >
                <GoogleIcon size={19} />
                <span>{googleLoading ? 'Signing in with Google...' : 'Sign in with Google'}</span>
              </button>

              <div className="register-signin-prompt">
                <span>Don't have an account? </span>
                <Link to="/register" className="register-signin-link">
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
