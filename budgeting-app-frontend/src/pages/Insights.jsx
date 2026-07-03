const mockInsights = [
  { id: 1, type: 'trend', message: 'You spent 32% more on takeaways this month than last month.' },
  { id: 2, type: 'forecast', message: 'If you continue at this pace, you will spend R14,000 this year on takeaways.' },
  { id: 3, type: 'anomaly', message: 'This grocery transaction (R2,400) is 3x higher than your usual grocery spend.' },
  { id: 4, type: 'suggestion', message: 'Cutting your daily coffee by R25 could save you about R750 this month.' },
];

const typeLabels = {
  trend: 'Trends',
  forecast: 'Forecasts',
  anomaly: 'Anomalies',
  suggestion: 'Suggestions',
};

const typeColors = {
  trend: '#378ADD',
  forecast: '#1D9E75',
  anomaly: '#D85A30',
  suggestion: '#B4B2A9',
};

function Insights() {
  const groups = ['trend', 'forecast', 'anomaly', 'suggestion'];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Insights</h2>

      {groups.map(type => {
        const items = mockInsights.filter(i => i.type === type);
        if (items.length === 0) return null;

        return (
          <div key={type} style={{ marginBottom: '20px' }}>
            <h3 style={{ color: typeColors[type] }}>{typeLabels[type]}</h3>
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  background: '#f5f5f5',
                  borderLeft: `4px solid ${typeColors[type]}`,
                  padding: '10px 14px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                }}
              >
                {item.message}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Insights;