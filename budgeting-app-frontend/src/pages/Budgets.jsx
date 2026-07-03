import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBudgets, createBudget, deleteBudget } from '../api/budgets';
import { getTransactions } from '../api/transactions';

function Budgets() {
  const { token } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ category: '', monthly_limit: '' });
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7); // "2026-07"

  useEffect(() => {
    Promise.all([getBudgets(token, currentMonth), getTransactions(token)])
      .then(([budgetsRes, txRes]) => {
        setBudgets(budgetsRes.data);
        setTransactions(txRes.data);
      })
      .catch(err => console.error('Failed to load budgets:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const getSpent = (category) => {
    return transactions
      .filter(t => t.category === category && t.type === 'expense' && t.date.slice(0, 7) === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    if (pct >= 100) return { color: 'red', label: 'Over budget' };
    if (pct >= 80) return { color: 'orange', label: 'Near limit' };
    return { color: 'green', label: 'On track' };
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Budgets</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input type="number" name="monthly_limit" placeholder="Monthly limit" value={form.monthly_limit} onChange={handleChange} required />
        <button type="submit">Save budget</button>
      </form>

      {loading && <p>Loading budgets...</p>}

      {!loading && budgets.map(b => {
        const spent = getSpent(b.category);
        const pct = Math.min((spent / b.monthly_limit) * 100, 100);
        const status = getStatus(spent, b.monthly_limit);
        return (
          <div key={b.id} style={{ marginBottom: '16px', border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{b.category}</strong>
              <span style={{ color: status.color }}>{status.label}</span>
              <button onClick={() => handleDelete(b.id)}>Delete</button>
            </div>
            <p>R{spent} of R{b.monthly_limit}</p>
            <div style={{ background: '#eee', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, background: status.color, height: '100%' }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Budgets;