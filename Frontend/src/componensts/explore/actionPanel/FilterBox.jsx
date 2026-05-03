import React, { useState } from "react";
import './FilterBox.css'

function FilterBox({ columns, onApply }) {
  const [column, setColumn] = useState("");
  const [operator, setOperator] = useState("==");
  const [value, setValue] = useState("");

  return (
    <div className="form-box">
      <h3>Filter Data</h3>

      <select onChange={(e) => setColumn(e.target.value)}>
        <option>Select Column</option>
        {columns.map(c => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select onChange={(e) => setOperator(e.target.value)}>
        <option value="==">=</option>
        <option value=">">{">"}</option>
        <option value="<">{"<"}</option>
        <option value="!=">!=</option>
      </select>

      <input
        placeholder="Enter value"
        onChange={(e) => setValue(e.target.value)}
      />

      <button onClick={() => onApply({
        type: "filter",
        column,
        operator,
        value
      })}>
        Apply
      </button>
    </div>
  );
}

export default FilterBox;