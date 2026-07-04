import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInsights } from '../api/insights';

const typeLabels = { trends: 'Trends', forecast: 'Forecasts', anomalies: 'Anomalies', suggestions: 'Suggestions' };

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

  const groups = ['trends', 'forecast', 'anomalies', 'suggestions'];
  const hasAny = insights && groups.some(g => insights[g]?.length > 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Signals</p>
          <h2 className="page-title">Insights</h2>
        </div>
      </div>

      {loading && <div className="skeleton" style={{ height: 240 }} />}
      {!loading && !hasAny && <div className="empty-state">Not enough activity yet to generate insights.</div>}

      {!loading && hasAny && groups.map(type => {
        const messages = insights[type];
        if (!messages || messages.length === 0) return null;
        return (
          <div key={type} style={{ marginBottom: '22px' }}>
            <p className="insight-group-label">{typeLabels[type]}</p>
            {messages.map((msg, i) => <div key={i} className="insight-card">{msg}</div>)}
          </div>
        );
      })}
    </div>
  );
}

export default Insights;