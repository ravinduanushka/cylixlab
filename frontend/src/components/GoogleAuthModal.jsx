import { useState } from 'react';
import { GoogleIcon } from './Icons';

const GoogleAuthModal = ({ isOpen, onClose, onGoogleSubmit, mode = 'login', defaultRole = 'student' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onGoogleSubmit({
        email,
        name: name.trim() || email.split('@')[0],
        googleId: 'g_' + Math.abs(email.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0)),
        role,
        studentName: role === 'parent' ? studentName : undefined,
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-modal-backdrop" onClick={onClose}>
      <div className="google-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="google-modal-header">
          <GoogleIcon size={32} />
          <h2 className="google-modal-title">
            {mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}
          </h2>
          <p className="google-modal-sub">to continue to <strong>CylixLab</strong></p>
        </div>

        {error && <div className="register-alert register-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="google-modal-form" noValidate>
          <div className="form-group">
            <label htmlFor="google-email" className="form-label">
              Google Email
            </label>
            <input
              type="email"
              id="google-email"
              className="form-input-pill"
              placeholder="e.g. name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="google-name" className="form-label">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="google-name"
              className="form-input-pill"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">I am registering as</label>
                <div className="google-role-toggle">
                  <button
                    type="button"
                    className={`google-role-btn ${role === 'student' ? 'active' : ''}`}
                    onClick={() => setRole('student')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`google-role-btn ${role === 'parent' ? 'active' : ''}`}
                    onClick={() => setRole('parent')}
                  >
                    Parent
                  </button>
                </div>
              </div>

              {role === 'parent' && (
                <div className="form-group">
                  <label htmlFor="google-student-name" className="form-label">
                    Student Name
                  </label>
                  <input
                    type="text"
                    id="google-student-name"
                    className="form-input-pill"
                    placeholder="Enter child / student name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>
              )}
            </>
          )}

          <div className="google-modal-actions">
            <button
              type="button"
              className="btn-google-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-google-confirm"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoogleAuthModal;
