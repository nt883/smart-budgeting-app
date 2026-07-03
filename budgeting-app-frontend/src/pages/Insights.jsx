import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInsights } from '../api/insights';

const typeLabels = {
  trends: 'Trends',
  forecast: 'Forecasts',
  anomalies: 'Anomalies',
  suggestions: 'Suggestions',
};

const typeColors = {
  trends: '#378ADD',
  forecast: '#1D9E75',
  anomalies: '#D85A30',
  suggestions: '#B4B2A9',
};

function Insights() {
  const { token } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInsights(token)
      .then(res => setInsights(res.data))
      .catch(err => console.error('Failed to load insights:', err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading insights...</div>;
  if (!insights) return <div style={{ padding: '2rem' }}>Failed to load insights.</div>;

  const groups = ['trends', 'forecast', 'anomalies', 'suggestions'];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Insights</h2>

      {groups.map(type => {
        const messages = insights[type];
        if (!messages || messages.length === 0) return null;

        return (
          <div key={type} style={{ marginBottom: '20px' }}>
            <h3 style={{ color: typeColors[type] }}>{typeLabels[type]}</h3>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  background: '#f5f5f5',
                  borderLeft: `4px solid ${typeColors[type]}`,
                  padding: '10px 14px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Insights;