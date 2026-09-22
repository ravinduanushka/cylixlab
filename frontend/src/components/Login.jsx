import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleIcon } from './Icons';
import GoogleAuthModal from './GoogleAuthModal';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleAuthSuccess = (data) => {
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    setMessage(data.message || 'Login successful! Redirecting...');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleGoogleClick = () => {
    if (window.google?.accounts?.id && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (credentialResponse) => {
          try {
            const response = await axios.post('/api/auth/google', {
              token: credentialResponse.credential,
            });
            handleAuthSuccess(response.data);
          } catch (err) {
            setError(err.response?.data?.message || 'Google authentication failed.');
          }
        },
      });
      window.google.accounts.id.prompt();
      return;
    }

    setIsGoogleModalOpen(true);
  };

  const handleGoogleSubmit = async (googleData) => {
    const response = await axios.post('/api/auth/google', googleData);
    handleAuthSuccess(response.data);
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

      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
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
                disabled={loading}
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
                onClick={handleGoogleClick}
                disabled={loading}
              >
                <GoogleIcon size={19} />
                <span>Sign in with Google</span>
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

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onGoogleSubmit={handleGoogleSubmit}
        mode="login"
      />
    </div>
  );
};

export default Login;
