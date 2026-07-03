import { useState } from 'react';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: '', limit: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = budgets.find(b => b.category === form.category);
    if (existing) {
      setBudgets(budgets.map(b => b.category === form.category ? { ...b, limit: form.limit } : b));
    } else {
      setBudgets([...budgets, { ...form, id: Date.now(), spent: 0 }]);
    }
    setForm({ category: '', limit: '' });
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
        <input type="number" name="limit" placeholder="Monthly limit" value={form.limit} onChange={handleChange} required />
        <button type="submit">Save budget</button>
      </form>

      {budgets.map(b => {
        const pct = Math.min((b.spent / b.limit) * 100, 100);
        const status = getStatus(b.spent, b.limit);
        return (
          <div key={b.id} style={{ marginBottom: '16px', border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{b.category}</strong>
              <span style={{ color: status.color }}>{status.label}</span>
            </div>
            <p>R{b.spent} of R{b.limit}</p>
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