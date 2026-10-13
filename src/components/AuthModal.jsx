import { useState } from 'react';
import { loginUser, registerUser } from '../api.js';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('NGO');
  const [organization, setOrganization] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState(null);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);

    try {
      let user;
      if (tab === 'login') {
        user = await loginUser(email.trim(), password);
      } else {
        user = await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          organization: organization.trim(),
        });
      }
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemo(demoEmail, demoPass) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setTab('login');
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{tab === 'login' ? 'Log in to SharePlate' : 'Create an Account'}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setTab('login');
              setAuthError(null);
            }}
          >
            Log In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setTab('register');
              setAuthError(null);
            }}
          >
            Register
          </button>
        </div>

        {authError && (
          <div className="alert-banner alert-error" style={{ margin: '0 0 16px' }}>
            <span>{authError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {tab === 'register' && (
            <>
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="e.g. Hope Foundation or Kunal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label>
                Role
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="NGO">NGO / Food Bank (Can claim food)</option>
                  <option value="VOLUNTEER">Community Volunteer (Can claim food)</option>
                  <option value="DONOR">Food Donor (Can donate food)</option>
                </select>
              </label>

              <label>
                Organization / Entity Name
                <input
                  type="text"
                  placeholder="e.g. Pune Relief Trust"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </label>
            </>
          )}

          <label>
            Email Address
            <input
              type="email"
              placeholder="you@domain.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Please wait...' : tab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#68766e', borderTop: '1px solid #eef2ed', paddingTop: '14px' }}>
          <strong>Demo credentials (click to autofill):</strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            <button
              type="button"
              className="logout-button"
              onClick={() => fillDemo('ngo@shareplate.org', 'ngo123')}
            >
              NGO Login
            </button>
            <button
              type="button"
              className="logout-button"
              onClick={() => fillDemo('volunteer@shareplate.org', 'volunteer123')}
            >
              Volunteer Login
            </button>
            <button
              type="button"
              className="logout-button"
              onClick={() => fillDemo('canteen@shareplate.org', 'donor123')}
            >
              Donor Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
