import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.2"/><rect x="11" y="2.5" width="6.5" height="6.5" rx="1.2"/>
      <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.2"/><rect x="11" y="11" width="6.5" height="6.5" rx="1.2"/>
    </svg>
  ),
  transactions: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 7h11M12 4l3 3-3 3"/><path d="M16 13H5M8 16l-3-3 3-3"/>
    </svg>
  ),
  budgets: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5" width="15" height="11" rx="2"/><path d="M2.5 8.5h15"/><circle cx="13.5" cy="12" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 15V10M9 15V5M15 15v-7M3 15h14"/>
    </svg>
  ),
  goals: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3.6"/><circle cx="10" cy="10" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.6"/>
      <path d="M10 3v1.6M10 15.4V17M17 10h-1.6M4.6 10H3M14.9 5.1l-1.1 1.1M6.2 13.7l-1.1 1.1M14.9 14.9l-1.1-1.1M6.2 6.3L5.1 5.2"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 16H4.5A1.5 1.5 0 013 14.5v-9A1.5 1.5 0 014.5 4H8"/><path d="M13 13l4-3-4-3M17 10H8"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
  ),
  close: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>
  ),
};

function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
    { to: '/transactions', label: 'Transactions', icon: icons.transactions },
    { to: '/budgets', label: 'Budgets', icon: icons.budgets },
    { to: '/insights', label: 'Insights', icon: icons.insights },
    { to: '/goals', label: 'Goals', icon: icons.goals },
  ];

  const initial = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <nav className="topbar">
      <span className="topbar-brand">[ledger]</span>

      <button className="topbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? icons.close : icons.menu}
      </button>

      <div className={`topbar-nav ${mobileOpen ? 'topbar-nav--open' : ''}`}>
        {links.map(link => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`topbar-link ${active ? 'topbar-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="topbar-right">
        <Link to="/settings" className="topbar-logout" title="Settings">{icons.settings}</Link>
        <div className="topbar-avatar">{initial}</div>
        <span className="topbar-user-email">{user?.email}</span>
        <button className="topbar-logout" onClick={handleLogout} title="Log out">{icons.logout}</button>
      </div>
    </nav>
  );
}

export default Navbar;