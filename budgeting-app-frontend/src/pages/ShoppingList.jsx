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

  const removeItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const optimize = () => {
    // Mock logic until Ntando's price catalog endpoint is ready
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
    <div style={{ padding: '2rem' }}>
      <h2>Shopping List Optimizer</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
          <h3>Your list</h3>

          <form onSubmit={addItem} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input type="text" placeholder="Item" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ width: '60px' }} />
            <button type="submit">Add</button>
          </form>

          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #ddd' }}>
              <span>{item.name} x{item.quantity}</span>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label>Budget</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="R" style={{ width: '100px' }} />
          </div>

          <button onClick={optimize} style={{ width: '100%', marginTop: '12px', background: '#378ADD', color: '#fff', border: 'none', padding: '8px' }}>
            Optimize
          </button>
        </div>

        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
          <h3>Results</h3>

          {!results && <p style={{ color: '#888' }}>Add items and click Optimize to see suggestions.</p>}

          {results && (
            <>
              <div style={{ background: '#e6f7ee', padding: '10px', borderRadius: '4px', marginBottom: '8px' }}>
                Fits in budget: R{results.total} total
              </div>

              {results.dropped.map(item => (
                <div key={item.id} style={{ background: '#fdf1e0', padding: '10px', borderRadius: '4px', marginBottom: '8px' }}>
                  <strong>Suggested drop:</strong> {item.name}
                </div>
              ))}

              {results.swaps.map((s, i) => (
                <div key={i} style={{ background: '#e8f0fb', padding: '10px', borderRadius: '4px', marginBottom: '8px' }}>
                  <strong>Swap:</strong> {s.suggestion} — save R{s.savings}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingList;