import React, { useState } from "react";
import "./OperationPanel.css";

import {
  numericalOps,
  categoricalOps,
  cleaningOps,
  viewOps,
} from "./Ops.js";

function OperationPanel({ columns = [], Data = [], onAnalyze }) {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [columnType, setColumnType] = useState("");
  const [operation, setOperation] = useState("");
  const [category, setCategory] = useState("analysis");

  const [selectedOpObj, setSelectedOpObj] = useState(null);
  const [result, setResult] = useState(null);



  const isHighCardinality = (columnName) => {
    const cleanValues = Data
      .map((row) => row[columnName])
      .filter(
        (v) =>
          v !== null &&
          v !== undefined &&
          v !== ""
      );

    const uniqueValues = new Set(cleanValues);

    return uniqueValues.size > 10;
  };


  const isNumerical = (type, columnName) => {
    if (!type) return false;

    const isNumericType =
      type.includes("int") ||
      type.includes("float") ||
      type.includes("double");

    if (!isNumericType) return false;

    const cleanValues = Data
      .map((row) => row[columnName])
      .filter(
        (v) =>
          v !== null &&
          v !== undefined &&
          v !== ""
      );

    const uniqueValues = new Set(cleanValues);

    const uniqueRatio =
      uniqueValues.size / cleanValues.length;

    return uniqueRatio > 0.05;
  };

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
        if (isNumerical(columnType, selectedColumn)) {
          return numericalOps;
        }

        if (isHighCardinality(selectedColumn)) {
          return [];
        }

        return categoricalOps;
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

   setResult(res);
  };

  return (
    <div className="operation-panel">
      <h2 className="operation-panel-title">Operation Panel</h2>

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

      {category !== "view" && (
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
      )}


      {
        !isNumerical(columnType, selectedColumn) &&
        isHighCardinality(selectedColumn) && (
          <p
            style={{
              color: "#ff4d4f",
              fontSize: "14px",
              marginTop: "8px"
            }}
          >
            Too many categories for Analyis
          </p>
        )
      }

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


      <button className="operation-panel-button" onClick={handleApply}>
        Apply
      </button>



      <div className="op-box">
        <h3>What will happen</h3>
        {selectedOpObj && (<p>{selectedOpObj.desc}</p>)}
      </div>




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