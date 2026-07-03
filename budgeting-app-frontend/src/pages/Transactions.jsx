import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/transactions';
import CsvImport from '../components/CsvImport';

function Transactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ date: '', description: '', category: '', amount: '', type: 'expense' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions(token)
      .then(res => setTransactions(res.data))
      .catch(err => console.error('Failed to load transactions:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };

    try {
      if (editingId) {
        const res = await updateTransaction(token, editingId, payload);
        setTransactions(transactions.map(t => t.id === editingId ? res.data : t));
        setEditingId(null);
      } else {
        const res = await createTransaction(token, payload);
        setTransactions([...transactions, res.data]);
      }
      setForm({ date: '', description: '', category: '', amount: '', type: 'expense' });
    } catch (err) {
      console.error('Failed to save transaction:', err);
    }
  };

  const handleEdit = (t) => {
    setForm({ date: t.date, description: t.description || '', category: t.category, amount: t.amount, type: t.type });
    setEditingId(t.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(token, id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Transactions</h2>

      <CsvImport onImport={async (rows) => {
        for (const row of rows) {
          try {
            const res = await createTransaction(token, { ...row, amount: Number(row.amount) });
            setTransactions(prev => [...prev, res.data]);
          } catch (err) {
            console.error('Failed to import row:', row, err);
          }
        }
      }} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} transaction</button>
      </form>

      {loading && <p>Loading transactions...</p>}

      {!loading && (
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
      )}
    </div>
  );
}

export default Transactions;