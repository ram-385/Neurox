import React ,{useState}from 'react'
import './groupBox.css'

function GroupBox({ columns, onApply }) {
  const [groupColumn, setGroupColumn] = useState("");
  const [aggColumn, setAggColumn] = useState("");
  const [operation, setOperation] = useState("mean");

  return (
    <div className="form-box">
      <h3>Group By</h3>

      <select onChange={(e) => setGroupColumn(e.target.value)}>
        {columns.map(c => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select onChange={(e) => setAggColumn(e.target.value)}>
        {columns.map(c => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select onChange={(e) => setOperation(e.target.value)}>
        <option value="mean">Mean</option>
        <option value="sum">Sum</option>
        <option value="count">Count</option>
      </select>

      <button onClick={() => onApply({
        type: "group",
        group_column: groupColumn,
        agg_column: aggColumn,
        operation
      })}>
        Apply
      </button>
    </div>
  );
}

export default GroupBox;