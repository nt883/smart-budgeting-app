import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGoals, createGoal, addSavings, deleteGoal, affordCheck } from '../api/goals';

function Goals() {
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ name: '', target_amount: '', target_date: '' });
  const [loading, setLoading] = useState(true);
  const [savingsInput, setSavingsInput] = useState({});
  const [affordItem, setAffordItem] = useState('');
  const [affordCost, setAffordCost] = useState('');
  const [affordResult, setAffordResult] = useState(null);

  useEffect(() => {
    getGoals(token)
      .then(res => setGoals(res.data))
      .catch(err => console.error('Failed to load goals:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createGoal(token, {
        name: form.name,
        target_amount: Number(form.target_amount),
        target_date: form.target_date,
      });
      setGoals([...goals, res.data]);
      setForm({ name: '', target_amount: '', target_date: '' });
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  const handleAddSavings = async (id) => {
    const amount = Number(savingsInput[id]);
    if (!amount) return;
    try {
      const res = await addSavings(token, id, amount);
      setGoals(goals.map(g => g.id === id ? res.data : g));
      setSavingsInput({ ...savingsInput, [id]: '' });
    } catch (err) {
      console.error('Failed to add savings:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(token, id);
      setGoals(goals.filter(g => g.id !== id));
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const checkAfford = async (e) => {
    e.preventDefault();
    try {
      const res = await affordCheck(token, Number(affordCost));
      setAffordResult(res.data);
    } catch (err) {
      console.error('Failed to check afford:', err);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Targets</p>
          <h2 className="page-title">Goals</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card field-row">
        <input type="text" name="name" placeholder="Goal name" value={form.name} onChange={handleChange} required />
        <input type="number" name="target_amount" placeholder="Target amount" value={form.target_amount} onChange={handleChange} required />
        <input type="date" name="target_date" value={form.target_date} onChange={handleChange} required />
        <button type="submit" className="btn btn-primary">Create goal</button>
      </form>

      {loading && <div className="skeleton" style={{ height: 140, marginBottom: 24 }} />}
      {!loading && goals.length === 0 && <div className="empty-state" style={{ marginBottom: 24 }}>No goals yet — create your first one above.</div>}

      <div style={{ display: 'grid', gap: '14px', marginBottom: '30px' }}>
        {!loading && goals.map(g => {
          const pct = Math.min((g.saved_amount / g.target_amount) * 100, 100);
          return (
            <div key={g.id} className="card card--interactive">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{g.name}</strong>
                <button className="btn btn-quiet" onClick={() => handleDelete(g.id)}>Delete</button>
              </div>
              <p className="mono" style={{ fontSize: 13, color: 'var(--ash)', margin: '8px 0' }}>
                R{g.saved_amount} <span style={{ color: 'var(--ash-dim)' }}>/ R{g.target_amount}</span> — by {g.target_date}
              </p>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <input
                  type="number"
                  placeholder="Add savings"
                  value={savingsInput[g.id] || ''}
                  onChange={(e) => setSavingsInput({ ...savingsInput, [g.id]: e.target.value })}
                  style={{ width: '130px' }}
                />
                <button className="btn btn-quiet" onClick={() => handleAddSavings(g.id)}>Add</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <p className="eyebrow">Afford check</p>
        <h3 style={{ marginBottom: 14 }}>Can I afford this?</h3>
        <form onSubmit={checkAfford} className="field-row">
          <input type="text" placeholder="Item name" value={affordItem} onChange={(e) => setAffordItem(e.target.value)} required />
          <input type="number" placeholder="Cost" value={affordCost} onChange={(e) => setAffordCost(e.target.value)} required />
          <button type="submit" className="btn btn-primary">Check</button>
        </form>
        {affordResult && (
          <p style={{ marginTop: 14, fontSize: 14 }}>
            <span className={`status-dot ${affordResult.can_afford ? 'status-dot--empty' : 'status-dot--full'}`} style={{ marginRight: 8 }} />
            <strong>{affordResult.can_afford ? 'Yes.' : 'Not yet.'}</strong> {affordResult.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Goals;