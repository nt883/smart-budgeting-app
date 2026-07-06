import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signup as signupApi } from '../api/auth';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await signupApi(email, password);
      login(res.data.access_token, { email });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
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
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', paddingRight: '38px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn-icon"
              style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ash)' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label className="field-label">Confirm password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', paddingRight: '38px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="btn-icon"
              style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ash)' }}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
        <p className="auth-footer-link">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}

export default Signup;