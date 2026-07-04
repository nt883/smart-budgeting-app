import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummary } from '../api/dashboard';

const COLORS = ['#141414', '#4A4A46', '#7A7870', '#A8A59A', '#D3D0C4'];

function monthLabel(ym) {
  const [y, m] = ym.split('-');
  return new Date(y, m - 1).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
}

function Dashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    getDashboardSummary(token, currentMonth)
      .then(res => setSummary(res.data))
      .catch(err => console.error('Failed to load dashboard:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const categoryData = summary ? Object.entries(summary.spend_by_category).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2 className="page-title">Dashboard</h2>
        </div>
        <span className="page-date mono">{monthLabel(currentMonth)}</span>
      </div>

      {loading && (
        <>
          <div className="stat-grid">
            <div className="skeleton" style={{ height: 96 }} />
            <div className="skeleton" style={{ height: 96 }} />
            <div className="skeleton" style={{ height: 96 }} />
          </div>
          <div className="skeleton" style={{ height: 300 }} />
        </>
      )}

      {!loading && summary && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <p className="stat-label">Income</p>
              <p className="stat-value">R{summary.total_income.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Expenses</p>
              <p className="stat-value">R{summary.total_expenses.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Net balance</p>
              <p className="stat-value">{summary.net_balance < 0 ? '\u2212' : ''}R{Math.abs(summary.net_balance).toLocaleString()}</p>
            </div>
          </div>

          <div className="card">
            <p className="stat-label" style={{ marginBottom: 16 }}>Spend by category</p>
            {categoryData.length === 0 ? (
              <div className="empty-state">No expenses recorded this month.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={95} label>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;