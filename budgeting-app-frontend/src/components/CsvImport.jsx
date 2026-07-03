import { useState } from 'react';
import Papa from 'papaparse';

function CsvImport({ onImport }) {
  const [preview, setPreview] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreview(results.data);
      },
    });
  };

  const confirmImport = () => {
    onImport(preview);
    setPreview([]);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input type="file" accept=".csv" onChange={handleFile} />

      {preview.length > 0 && (
        <div>
          <p>Preview ({preview.length} rows):</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>{Object.keys(preview[0]).map(key => <th key={key}>{key}</th>)}</tr>
            </thead>
            <tbody>
              {preview.slice(0, 5).map((row, i) => (
                <tr key={i}>{Object.values(row).map((val, j) => <td key={j}>{val}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <button onClick={confirmImport}>Confirm import</button>
        </div>
      )}
    </div>
  );
}

export default CsvImport;