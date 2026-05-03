import React, { useState } from "react";
import "./OperationPanel.css";

import {
  numericalOps,
  categoricalOps,
  cleaningOps,
  viewOps,
} from "./Ops.js";

function OperationPanel({ columns = [], onAnalyze }) {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [columnType, setColumnType] = useState("");
  const [operation, setOperation] = useState("");
  const [category, setCategory] = useState("analysis");

  const [selectedOpObj, setSelectedOpObj] = useState(null);
  const [result, setResult] = useState(null);

  const handleColumnChange = (e) => {
    const colName = e.target.value;
    setSelectedColumn(colName);

    const colObj = columns.find((c) => c.name === colName);
    setColumnType(colObj?.type || "");

    setOperation("");
    setSelectedOpObj(null);
    setResult(null);
  };

  const getOps = () => {
    switch (category) {
      case "cleaning":
        return cleaningOps;
      case "view":
        return viewOps;
      default:
        return columnType === "int64" || columnType === "float64"
          ? numericalOps
          : categoricalOps;
    }
  };

  const ops = getOps();

  const handleApply = async () => {
    if (!operation) return;

    const opObj = ops.find((o) => o.value === operation);
    setSelectedOpObj(opObj);

    const res = await onAnalyze?.({
      column: selectedColumn,
      operation,
      type: columnType,
      category,
    });

    // assume backend returns result
    if (res) setResult(res);
  };

  return (
    <div className="operation-panel">
      <h2 className="operation-panel-title">Operation Panel</h2>

      {/* CATEGORY */}
      <select
        className="operation-panel-select"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setOperation("");
          setResult(null);
        }}
      >
        <option value="analysis">Analysis</option>
        <option value="cleaning">Cleaning</option>
        <option value="view">View</option>
      </select>

      {/* COLUMN */}
      <select
        className="operation-panel-select"
        value={selectedColumn}
        onChange={handleColumnChange}
      >
        <option value="">Select Column</option>
        {columns.map((col, i) => (
          <option key={i} value={col.name}>
            {col.name}
          </option>
        ))}
      </select>

      {/* OPERATION */}
      <select
        className="operation-panel-select"
        value={operation}
        onChange={(e) => {
          const value = e.target.value;
          setOperation(value);

          const opObj = ops.find((o) => o.value === value);
          setSelectedOpObj(opObj);
        }}
        disabled={!selectedColumn && category !== "view"}
      >
        <option value="">Select Operation</option>

        {ops.map((op, i) => (
          <option key={i} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {/* BUTTON */}
      <button className="operation-panel-button" onClick={handleApply}>
        Apply
      </button>

      {/* WHAT WILL HAPPEN */}
     
        <div className="op-box">
          <h3>What will happen</h3>
          {selectedOpObj &&  (  <p>{selectedOpObj.desc}</p> )}
        </div>
   

      {/* RESULT BOX */}
     
        <div className="result-box">
          <h3>Result</h3>
           {result && (
          <pre>{JSON.stringify(result, null, 2)}</pre>
            )}
        </div>
    
    </div>
  );
}

export default OperationPanel;