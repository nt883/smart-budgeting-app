import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginApi(email, password);
      login(res.data.access_token, { email });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="auth-shell">
      <form onSubmit={handleSubmit} className="auth-card">
        <span className="brand-mark">[ledger]</span>
        <h2 className="auth-title">Log in</h2>
        <p className="auth-sub">Welcome back to your budget.</p>
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-field">
          <label className="field-label">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="auth-field">
          <label className="field-label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Log in</button>
        <p className="auth-footer-link">No account? <Link to="/signup">Sign up</Link> · <Link to="/forgot-password">Forgot password</Link></p>
      </form>
    </div>
  );
}

export default Login;