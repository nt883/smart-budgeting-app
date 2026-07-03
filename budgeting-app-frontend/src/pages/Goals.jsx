import { useState } from 'react';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ name: '', target: '', date: '' });
  const [affordItem, setAffordItem] = useState('');
  const [affordCost, setAffordCost] = useState('');
  const [affordResult, setAffordResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGoals([...goals, { ...form, id: Date.now(), saved: 0 }]);
    setForm({ name: '', target: '', date: '' });
  };

  const checkAfford = (e) => {
    e.preventDefault();
    // Mock logic until backend endpoint exists
    const canAfford = Number(affordCost) < 5000;
    setAffordResult({
      answer: canAfford ? 'Yes' : 'Not yet',
      reason: canAfford
        ? `Based on your current savings pace, you can afford ${affordItem}.`
        : `You would need to save more before affording ${affordItem}.`,
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Goals</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="text" name="name" placeholder="Goal name" value={form.name} onChange={handleChange} required />
        <input type="number" name="target" placeholder="Target amount" value={form.target} onChange={handleChange} required />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <button type="submit">Create goal</button>
      </form>

      {goals.map(g => {
        const pct = Math.min((g.saved / g.target) * 100, 100);
        return (
          <div key={g.id} style={{ marginBottom: '16px', border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
            <strong>{g.name}</strong>
            <p>R{g.saved} of R{g.target} — by {g.date}</p>
            <div style={{ background: '#eee', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, background: '#378ADD', height: '100%' }}></div>
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
            <strong>{affordResult.answer}.</strong> {affordResult.reason}
          </p>
        )}
      </div>
    </div>
  );
}

export default Goals;