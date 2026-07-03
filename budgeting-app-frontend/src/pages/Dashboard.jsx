import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummary } from '../api/dashboard';

const COLORS = ['#378ADD', '#1D9E75', '#D85A30', '#B4B2A9', '#9B59B6', '#E67E22'];

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

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;
  if (!summary) return <div style={{ padding: '2rem' }}>Failed to load dashboard.</div>;

  const categoryData = Object.entries(summary.spend_by_category).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
          <p>Income</p>
          <h3>R{summary.total_income.toLocaleString()}</h3>
        </div>
        <div style={{ flex: 1, background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
          <p>Expenses</p>
          <h3>R{summary.total_expenses.toLocaleString()}</h3>
        </div>
        <div style={{ flex: 1, background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
          <p>Net balance</p>
          <h3 style={{ color: summary.net_balance >= 0 ? 'green' : 'red' }}>R{summary.net_balance.toLocaleString()}</h3>
        </div>
      </div>

      <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', height: '300px' }}>
        <p>Spend by category</p>
        {categoryData.length === 0 ? (
          <p style={{ color: '#888' }}>No expenses recorded this month.</p>
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90} label>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Dashboard;