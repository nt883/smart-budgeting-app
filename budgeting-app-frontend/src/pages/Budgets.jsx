import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBudgets, createBudget, deleteBudget } from '../api/budgets';
import { getTransactions } from '../api/transactions';
import { CATEGORIES } from '../constants/categories';

function Budgets() {
  const { token } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ category: '', monthly_limit: '' });
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    Promise.all([getBudgets(token, currentMonth), getTransactions(token)])
      .then(([budgetsRes, txRes]) => {
        setBudgets(budgetsRes.data);
        setTransactions(txRes.data);
      })
      .catch(err => console.error('Failed to load budgets:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const getSpent = (category) =>
    transactions
      .filter(t => t.category === category && t.type === 'expense' && t.date.slice(0, 7) === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createBudget(token, {
        category: form.category,
        monthly_limit: Number(form.monthly_limit),
        month: currentMonth,
      });
      setBudgets([...budgets, res.data]);
      setForm({ category: '', monthly_limit: '' });
    } catch (err) {
      console.error('Failed to save budget:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(token, id);
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  const getStatus = (spent, limit) => {
    const pct = (spent / limit) * 100;
    if (pct >= 100) return { dot: 'status-dot--full', label: 'Over budget' };
    if (pct >= 80) return { dot: 'status-dot--half', label: 'Near limit' };
    return { dot: 'status-dot--empty', label: 'On track' };
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Limits</p>
          <h2 className="page-title">Budgets</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card field-row">
        <select name="category" value={form.category} onChange={handleChange} required>
  <option value="" disabled>Select category</option>
  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
</select>
        <input type="number" name="monthly_limit" placeholder="Monthly limit" value={form.monthly_limit} onChange={handleChange} required />
        <button type="submit" className="btn btn-primary">Save budget</button>
      </form>

      {loading && <div className="skeleton" style={{ height: 160 }} />}
      {!loading && budgets.length === 0 && <div className="empty-state">No budgets set for this month yet.</div>}

      <div style={{ display: 'grid', gap: '14px' }}>
        {!loading && budgets.map(b => {
          const spent = getSpent(b.category);
          const pct = Math.min((spent / b.monthly_limit) * 100, 100);
          const over = spent > b.monthly_limit;
          const status = getStatus(spent, b.monthly_limit);
          return (
            <div key={b.id} className="card card--interactive">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <strong>{b.category}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className="status"><span className={`status-dot ${status.dot}`} />{status.label}</span>
                  <button className="btn btn-quiet" onClick={() => handleDelete(b.id)}>Delete</button>
                </div>
              </div>
              <p className="mono" style={{ fontSize: 13, color: 'var(--ash)', marginBottom: 8 }}>
                R{spent} <span style={{ color: 'var(--ash-dim)' }}>/ R{b.monthly_limit}</span>
              </p>
              <div className="progress-track">
                <div className={`progress-fill ${over ? 'progress-fill--over' : ''}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Budgets;