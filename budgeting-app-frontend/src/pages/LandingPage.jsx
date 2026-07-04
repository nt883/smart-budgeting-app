import { Link } from 'react-router-dom';

const icon = (children) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    {children}
  </svg>
);

function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link to="/" className="brand-mark" style={{ marginBottom: 0 }}>[ledger]</Link>
        <div className="landing-nav-links">
          <Link to="/login" className="btn btn-quiet">Log in</Link>
          <Link to="/signup" className="btn btn-primary">Sign up</Link>
        </div>
      </nav>

      <div className="landing-hero">
        <p className="landing-eyebrow">Personal finance, kept honest</p>
        <h1 className="landing-headline">Know exactly where your money goes — before it's gone.</h1>
        <p className="landing-sub">
          [ledger] tracks every rand in and out, warns you before you overspend, and tells you —
          in plain language — what your own spending pattern is actually doing to your budget.
        </p>
        <div className="landing-cta-row">
          <Link to="/signup" className="btn btn-primary">Get started free</Link>
          <Link to="/login" className="btn">Log in</Link>
        </div>
      </div>

      <div className="landing-preview">
        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-label">Income</p>
            <p className="stat-value">R18,400</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Expenses</p>
            <p className="stat-value">R12,150</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Net balance</p>
            <p className="stat-value">R6,250</p>
          </div>
        </div>
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">{icon(<><rect x="2.5" y="5" width="15" height="11" rx="2"/><path d="M2.5 8.5h15"/></>)}</div>
          <h3>Budgets that warn you early</h3>
          <p>Set a monthly limit per category and get a clear signal — on track, near the limit, or over — before it becomes a problem.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">{icon(<path d="M3 15V10M9 15V5M15 15v-7M3 15h14"/>)}</div>
          <h3>Insights, not just numbers</h3>
          <p>Automatic, plain-English observations about your spending — trends, forecasts, and anomalies — calculated from your own data.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">{icon(<><path d="M5 7h10l-1 9H6L5 7z"/><path d="M7.5 7V5.5a2.5 2.5 0 015 0V7"/></>)}</div>
          <h3>Shop smarter, not harder</h3>
          <p>Hand it a shopping list and a budget — it tells you what fits, what to drop, and where to find it cheaper.</p>
        </div>
      </div>

      <footer className="landing-footer">[ledger] — built for people who actually want to know where their money goes.</footer>
    </div>
  );
}

export default Landing;