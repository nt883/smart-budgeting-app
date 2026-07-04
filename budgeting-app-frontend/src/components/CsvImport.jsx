import { useState, useRef } from 'react';
import Papa from 'papaparse';

function CsvImport({ onImport }) {
  const [preview, setPreview] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setPreview(results.data),
    });
  };

  const confirmImport = () => {
    onImport(file);
    setPreview([]);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ marginBottom: '18px' }}>
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} id="csv-upload" />
      <label htmlFor="csv-upload" className="btn btn-quiet" style={{ display: 'inline-flex', cursor: 'pointer' }}>
        {file ? file.name : 'Import CSV'}
      </label>

      {preview.length > 0 && (
        <div className="card" style={{ marginTop: '12px' }}>
          <p className="stat-label" style={{ marginBottom: 10 }}>Preview — {preview.length} rows</p>
          <table className="ledger-table">
            <thead><tr>{Object.keys(preview[0]).map(key => <th key={key}>{key}</th>)}</tr></thead>
            <tbody>
              {preview.slice(0, 5).map((row, i) => (
                <tr key={i}>{Object.values(row).map((val, j) => <td key={j}>{val}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <button onClick={confirmImport} className="btn btn-primary" style={{ marginTop: '12px' }}>Confirm import</button>
        </div>
      )}
    </div>
  );
}

export default CsvImport;