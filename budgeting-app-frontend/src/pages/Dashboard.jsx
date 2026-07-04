import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummary } from '../api/dashboard';

const COLORS = ['#141414', '#D8D4C8', '#585650', '#B0AC9E', '#3A3934', '#8C887A', '#EDE9DD', '#726E62'];

function monthLabel(ym) {
  const [y, m] = ym.split('-');
  return new Date(y, m - 1).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
}

const renderLabel = ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`;

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
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={95} label={renderLabel}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="var(--surface)" strokeWidth={2} />
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