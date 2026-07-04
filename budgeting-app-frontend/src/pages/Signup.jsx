import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup as signupApi } from '../api/auth';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await signupApi(email, password);
      login(res.data.access_token, { email });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div className="auth-shell">
      <form onSubmit={handleSubmit} className="auth-card">
        <span className="brand-mark">[ledger]</span>
        <h2 className="auth-title">Sign up</h2>
        <p className="auth-sub">Start tracking, in under a minute.</p>
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-field">
          <label className="field-label">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="auth-field">
          <label className="field-label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="auth-field">
          <label className="field-label">Confirm password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign up</button>
        <p className="auth-footer-link">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}

export default Signup;