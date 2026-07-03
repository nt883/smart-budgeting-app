import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar({ collapsed, setCollapsed }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/transactions', label: 'Transactions' },
    { to: '/budgets', label: 'Budgets' },
    { to: '/insights', label: 'Insights' },
    { to: '/goals', label: 'Goals' },
    { to: '/shopping-list', label: 'Shopping List' },
  ];

  return (
    <nav
      style={{
        width: collapsed ? '60px' : '200px',
        height: '100vh',
        background: '#1a1a1a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 8px',
        transition: 'width 0.2s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{ background: 'none', border: 'none', color: '#fff', marginBottom: '20px', cursor: 'pointer', fontSize: '18px' }}
      >
        {collapsed ? '☰' : '✕'}
      </button>

      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          style={{ color: '#fff', textDecoration: 'none', padding: '10px 8px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden' }}
        >
          {collapsed ? link.label[0] : link.label}
        </Link>
      ))}

      <button
        onClick={handleLogout}
        style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '10px 8px', marginTop: 'auto', cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        {collapsed ? '⎋' : 'Log out'}
      </button>
    </nav>
  );
}

export default Navbar;