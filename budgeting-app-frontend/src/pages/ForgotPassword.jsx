import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  return (
    <div className="auth-shell">
      <form onSubmit={handleSubmit} className="auth-card">
        <span className="brand-mark">[ledger]</span>
        <h2 className="auth-title">Reset password</h2>
        {submitted ? (
          <p className="auth-sub" style={{ marginTop: '8px' }}>If that email exists, a reset link has been sent.</p>
        ) : (
          <>
            <p className="auth-sub">We'll send a reset link to your email.</p>
            <div className="auth-field">
              <label className="field-label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send reset link</button>
          </>
        )}
        <p className="auth-footer-link"><Link to="/login">Back to log in</Link></p>
      </form>
    </div>
  );
}

export default ForgotPassword;