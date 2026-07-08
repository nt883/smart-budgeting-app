import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, importCsv } from '../api/transactions';
import { CATEGORIES } from '../constants/categories';
import CsvImport from '../components/CsvImport';

function Transactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ date: '', description: '', category: '', amount: '', type: 'expense' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getTransactions(token)
      .then(res => setTransactions(res.data))
      .catch(err => console.error('Failed to load transactions:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    setDeletingId(id);
    try {
      await deleteTransaction(token, id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCsvImport = async (file) => {
    try {
      const res = await importCsv(token, file);
      alert(res.data.message);
      const refreshed = await getTransactions(token);
      setTransactions(refreshed.data);
    } catch (err) {
      console.error('CSV import failed:', err);
      alert(err.response?.data?.detail || 'CSV import failed');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Records</p>
          <h2 className="page-title">Transactions</h2>
        </div>
      </div>

      <CsvImport onImport={handleCsvImport} />

      <form onSubmit={handleSubmit} className="form-card field-row">
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="" disabled>Select category</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} transaction</button>
      </form>

      {loading && <div className="skeleton" style={{ height: 240 }} />}
      {!loading && transactions.length === 0 && <div className="empty-state">No transactions yet — add one above or import a CSV.</div>}

      {!loading && transactions.length > 0 && (
        <div className="ledger-table-wrap">
        <table className="ledger-table">
          <thead>
            <tr><th>Date</th><th>Description</th><th>Category</th><th style={{textAlign:'right'}}>Amount</th><th></th></tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td className="mono">{t.date}</td>
                <td>{t.description}</td>
                <td><span className="tag">{t.category}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`amount ${t.type === 'income' ? 'amount--in' : 'amount--out'}`}>R{t.amount}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-quiet" onClick={() => handleEdit(t)} style={{ marginRight: 6 }} disabled={deletingId === t.id}>
                    Edit
                  </button>
                  <button className="btn btn-quiet" onClick={() => handleDelete(t.id)} disabled={deletingId === t.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {deletingId === t.id && <span className="spinner" />}
                    {deletingId === t.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         </div>
      )}
    </div>
  );
}

export default Transactions;