import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const categoryData = [
  { name: 'Groceries', value: 1170 },
  { name: 'Transport', value: 450 },
  { name: 'Entertainment', value: 300 },
  { name: 'Other', value: 230 },
];

const spendOverTime = [
  { day: 'Wk1', amount: 800 },
  { day: 'Wk2', amount: 1200 },
  { day: 'Wk3', amount: 950 },
  { day: 'Wk4', amount: 1400 },
];

const COLORS = ['#378ADD', '#1D9E75', '#D85A30', '#B4B2A9'];

function Dashboard() {
  const income = 18400;
  const expenses = 12150;
  const balance = income - expenses;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
          <p>Income</p>
          <h3>R{income.toLocaleString()}</h3>
        </div>
        <div style={{ flex: 1, background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
          <p>Expenses</p>
          <h3>R{expenses.toLocaleString()}</h3>
        </div>
        <div style={{ flex: 1, background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
          <p>Net balance</p>
          <h3 style={{ color: balance >= 0 ? 'green' : 'red' }}>R{balance.toLocaleString()}</h3>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, background: '#f5f5f5', padding: '16px', borderRadius: '8px', height: '260px' }}>
          <p>Spend over time</p>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={spendOverTime}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#378ADD" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, background: '#f5f5f5', padding: '16px', borderRadius: '8px', height: '260px' }}>
          <p>Spend by category</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={70} label>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
        <p>Groceries budget</p>
        <div style={{ background: '#ddd', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
          <div style={{ width: '78%', background: '#e0a020', height: '100%' }}></div>
        </div>
        <p style={{ fontSize: '13px', color: '#888' }}>R1,170 of R1,500 used</p>
      </div>
    </div>
  );
}

export default Dashboard;