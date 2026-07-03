import { useState } from 'react';
import CsvImport from '../components/CsvImport';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ date: '', description: '', category: '', amount: '', type: 'expense' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setTransactions(transactions.map(t => t.id === editingId ? { ...form, id: editingId } : t));
      setEditingId(null);
    } else {
      setTransactions([...transactions, { ...form, id: Date.now() }]);
    }
    setForm({ date: '', description: '', category: '', amount: '', type: 'expense' });
  };

  const handleEdit = (t) => {
    setForm(t);
    setEditingId(t.id);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Transactions</h2>

      <CsvImport onImport={(rows) => {
        const newTransactions = rows.map(row => ({ ...row, id: Date.now() + Math.random() }));
        setTransactions([...transactions, ...newTransactions]);
      }} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} transaction</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Type</th><th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td>{t.amount}</td>
              <td>{t.type}</td>
              <td>
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;