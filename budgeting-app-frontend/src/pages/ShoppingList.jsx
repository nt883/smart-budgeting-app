import { useState } from 'react';

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [budget, setBudget] = useState('');
  const [results, setResults] = useState(null);

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, { id: Date.now(), name: itemName, quantity }]);
    setItemName('');
    setQuantity('1');
  };

  const removeItem = (id) => setItems(items.filter(i => i.id !== id));

  const optimize = () => {
    const mockPrices = { bread: 22, milk: 25, rice: 45, chicken: 85, 'dish soap': 30 };
    let total = 0;
    const fits = [];
    const dropped = [];
    const swaps = [];

    items.forEach(item => {
      const key = item.name.toLowerCase();
      const price = (mockPrices[key] || 30) * Number(item.quantity);
      if (total + price <= Number(budget)) {
        total += price;
        fits.push(item);
      } else {
        dropped.push(item);
      }
    });

    if (fits.find(i => i.name.toLowerCase() === 'rice')) {
      swaps.push({ item: 'Rice', suggestion: 'Store-brand rice', savings: 12 });
    }

    setResults({ total, fits, dropped, swaps });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Optimizer</p>
          <h2 className="page-title">Shopping List</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        <div className="card">
          <p className="stat-label" style={{ marginBottom: 14 }}>Your list</p>

          <form onSubmit={addItem} className="field-row" style={{ marginBottom: 14 }}>
            <input type="text" placeholder="Item" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ width: '64px' }} />
            <button type="submit" className="btn btn-quiet">Add</button>
          </form>

          {items.length === 0 && <p style={{ fontSize: 13, color: 'var(--ash)' }}>No items added yet.</p>}

          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
              <span className="mono">{item.name} <span style={{ color: 'var(--ash)' }}>×{item.quantity}</span></span>
              <button className="btn-icon" onClick={() => removeItem(item.id)} title="Remove" style={{ color: 'var(--ash)' }}>✕</button>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <label className="field-label">Budget</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="R" style={{ width: '140px' }} />
          </div>

          <button onClick={optimize} className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>Optimize</button>
        </div>

        <div className="card">
          <p className="stat-label" style={{ marginBottom: 14 }}>Results</p>
          {!results && <div className="empty-state">Add items and click Optimize to see suggestions.</div>}
          {results && (
            <>
              <div className="insight-card">Fits in budget: <span className="mono">R{results.total}</span> total</div>
              {results.dropped.map(item => (
                <div key={item.id} className="insight-card"><strong>Suggested drop:</strong> {item.name}</div>
              ))}
              {results.swaps.map((s, i) => (
                <div key={i} className="insight-card"><strong>Swap:</strong> {s.suggestion} — save R{s.savings}</div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingList;