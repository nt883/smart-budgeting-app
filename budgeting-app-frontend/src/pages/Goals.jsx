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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <div style={{ padding: '2rem' }}>
      <h2>Goals</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="text" name="name" placeholder="Goal name" value={form.name} onChange={handleChange} required />
        <input type="number" name="target_amount" placeholder="Target amount" value={form.target_amount} onChange={handleChange} required />
        <input type="date" name="target_date" value={form.target_date} onChange={handleChange} required />
        <button type="submit">Create goal</button>
      </form>

      {loading && <p>Loading goals...</p>}

      {!loading && goals.map(g => {
        const pct = Math.min((g.saved_amount / g.target_amount) * 100, 100);
        return (
          <div key={g.id} style={{ marginBottom: '16px', border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{g.name}</strong>
              <button onClick={() => handleDelete(g.id)}>Delete</button>
            </div>
            <p>R{g.saved_amount} of R{g.target_amount} — by {g.target_date}</p>
            <div style={{ background: '#eee', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, background: '#378ADD', height: '100%' }}></div>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder="Add savings"
                value={savingsInput[g.id] || ''}
                onChange={(e) => setSavingsInput({ ...savingsInput, [g.id]: e.target.value })}
                style={{ width: '120px' }}
              />
              <button onClick={() => handleAddSavings(g.id)}>Add</button>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: '30px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Can I afford this?</h3>
        <form onSubmit={checkAfford} style={{ display: 'flex', gap: '8px' }}>
          <input type="text" placeholder="Item name" value={affordItem} onChange={(e) => setAffordItem(e.target.value)} required />
          <input type="number" placeholder="Cost" value={affordCost} onChange={(e) => setAffordCost(e.target.value)} required />
          <button type="submit">Check</button>
        </form>
        {affordResult && (
          <p style={{ marginTop: '10px' }}>
            <strong>{affordResult.can_afford ? 'Yes' : 'Not yet'}.</strong> {affordResult.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Goals;