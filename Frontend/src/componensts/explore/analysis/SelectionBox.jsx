import React, { useState } from "react";
import "./SelectionBox.css";

import {
  numericalGraphOps,
  categoricalGraphOps,
} from "./UniOps";

function SelectionBox({ columns = [], Data = [], onAnalyze }) {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [columnType, setColumnType] = useState("");
  const [operation, setOperation] = useState("");

  const handleColumnChange = (e) => {
    const colName = e.target.value;
    setSelectedColumn(colName);

    const colObj = columns.find((c) => c.name === colName);
    setColumnType(colObj?.type || "");

    setOperation("");
  };

  const isNumerical = (type) => {
  return ["int", "float", "double"].some(t => type.toLowerCase().includes(t));
};

const ops = isNumerical(columnType)
  ? numericalGraphOps
  : categoricalGraphOps;

  return (
    <div className="selection-box">

       <h3 style={{color:'#00ffaa'}}>Analysis Controll</h3>

      <div style={{width:'90%'}}>
      <select value={selectedColumn} onChange={handleColumnChange}>
        <option value="">Select Column</option>

        {columns.map((col, i) => (
          <option key={i} value={col.name}>
            {col.name}
          </option>
        ))}
      </select>

      <select
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
        disabled={!columnType}
      >
        <option value="">Select Operation</option>

        {ops.map((op, i) => (
          <option key={i} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
</div>
      <button
        onClick={() => {
          if (!selectedColumn || !operation) {
            alert("Please select column and operation");
            return;
          }

          const values = Data.map(row => row[selectedColumn]);
                  onAnalyze?.({
            column: selectedColumn,
            operation,
            type: columnType,
            category: "analysis",  
            values,
          });
        }}
      >
        Analyze
      </button>
    </div>
  );
}

export default SelectionBox;