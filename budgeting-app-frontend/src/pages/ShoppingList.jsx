import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createShoppingList, optimizeShoppingList } from '../api/shopping';

function ShoppingList() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [budget, setBudget] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, { id: Date.now(), name: itemName, quantity: Number(quantity) }]);
    setItemName('');
    setQuantity('1');
  };

  const removeItem = (id) => setItems(items.filter(i => i.id !== id));

  const optimize = async () => {
    setError('');
    setLoading(true);
    try {
      const createRes = await createShoppingList(token, {
        budget: Number(budget),
        items: items.map(i => ({ item_name: i.name, quantity: i.quantity })),
      });
      const optimizeRes = await optimizeShoppingList(token, createRes.data.id);
      setResults(optimizeRes.data);
    } catch (err) {
      console.error('Optimize failed:', err);
      setError(err.response?.data?.detail || 'Failed to optimize list');
    } finally {
      setLoading(false);
    }
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

          {error && <p className="auth-error" style={{ marginTop: 12 }}>{error}</p>}

          <button
            onClick={optimize}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 16 }}
            disabled={loading || items.length === 0 || !budget}
          >
            {loading ? 'Optimizing...' : 'Optimize'}
          </button>
        </div>

        <div className="card">
          <p className="stat-label" style={{ marginBottom: 14 }}>Results</p>

          {!results && <div className="empty-state">Add items and click Optimize to see suggestions.</div>}

          {results && (
            <>
              <div className="insight-card">
                Total: <span className="mono">R{results.total_cost}</span> of R{results.budget}
                {' — '}{results.within_budget ? 'within budget' : 'over budget'}
              </div>

              {results.items.map((item, i) => (
                <div key={i} className="insight-card">
                  <strong>{item.item_name}</strong> — {item.included_quantity} of {item.requested_quantity} included
                  {item.included && <> at <span className="mono">{item.best_shop}</span>, R{item.unit_price}/unit (R{item.total_price} total)</>}
                  {!item.included && <> — no price data available</>}
                </div>
              ))}

              {results.dropped_items.length > 0 && (
                <div className="insight-card">
                  <strong>Short on:</strong> {results.dropped_items.join(', ')}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingList;