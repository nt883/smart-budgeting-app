import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteAccount } from '../api/account';

function Settings() {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('This permanently deletes your account and all your data. This cannot be undone. Continue?');
    if (!confirmed) return;

    setDeleting(true);
    setError('');
    try {
      await deleteAccount(token);
      logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account:', err);
      setError('Could not delete account — this needs a backend endpoint from Ntando first.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h2 className="page-title">Settings</h2>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <p className="stat-label" style={{ marginBottom: 10 }}>Signed in as</p>
        <p className="mono">{user?.email}</p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <p className="stat-label" style={{ marginBottom: 10 }}>Session</p>
        <button className="btn" onClick={handleLogout}>Log out</button>
      </div>

      <div className="card" style={{ borderTop: '2px solid var(--ink)' }}>
        <p className="stat-label" style={{ marginBottom: 10 }}>Danger zone</p>
        <p style={{ fontSize: 13, color: 'var(--ash)', marginBottom: 14 }}>
          Deleting your account permanently removes all transactions, budgets, goals, and history.
        </p>
        {error && <p className="auth-error">{error}</p>}
        <button className="btn" onClick={handleDeleteAccount} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete account'}
        </button>
      </div>
    </div>
  );
}

export default Settings;