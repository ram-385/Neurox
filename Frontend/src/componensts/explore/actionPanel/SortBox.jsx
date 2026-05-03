import React,{useState} from "react";
import './Sortbox.css'

function SortBox({ columns, onApply }) {
  const [column, setColumn] = useState("");
  const [order, setOrder] = useState("asc");

  return (
    <div className="form-box">
      <h3>Sort Data</h3>

      <select onChange={(e) => setColumn(e.target.value)}>
        {columns.map(c => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select onChange={(e) => setOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <button onClick={() => onApply({
        type: "sort",
        column,
        order
      })}>
        Apply
      </button>
    </div>
  );
}

export default SortBox;