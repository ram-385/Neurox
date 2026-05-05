import React, { useState } from "react";
import "./OperationPanel.css";
import { featureOps } from "./Operations";

function OperationPanel({ columns = [], onAnalyze }) {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [operation, setOperation] = useState("");
  const [subOperation, setSubOperation] = useState("");
  const [params, setParams] = useState({});
  const [selectedOpObj, setSelectedOpObj] = useState(null);

  // Column Selection (Max 3 Step-by-step)
  const handleColumnChange = (value, index) => {
    const updated = [...selectedColumns];
    updated[index] = value;
    setSelectedColumns(updated);
  };

  const renderColumnSelect = (index) => {
    const isVisible =
      index === 0 ||
      (index === 1 && selectedColumns[0]) ||
      (index === 2 && selectedColumns[1]);

    if (!isVisible) return null;

    return (
      <select
        key={index}
        className="operation-panel-select"
        value={selectedColumns[index] || ""}
        onChange={(e) => handleColumnChange(e.target.value, index)}
      >
        <option value="">Select Column {index + 1}</option>
        {columns.map((col, i) => (
          <option key={i} value={col.name}>
            {col.name}
          </option>
        ))}
      </select>
    );
  };

  // Selected Operation Objects
  const selectedOp = featureOps.find((op) => op.value === operation);
  const selectedSubOp = selectedOp?.options?.find(
    (opt) => opt.value === subOperation
  );

  // Params Renderer (Fully Dynamic)
  const renderParams = () => {
    if (!selectedSubOp || !selectedSubOp.params?.length) return null;

    return (
      <div className="params-box">
        <h3>Parameters</h3>

        {selectedSubOp.params.map((param, i) => {
          // Number Input
          if (param.type === "number") {
            return (
              <input
                key={i}
                type="number"
                placeholder={param.label}
                defaultValue={param.default || ""}
                className="operation-panel-select"
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    [param.name]: Number(e.target.value),
                  }))
                }
              />
            );
          }

          // Text Input  (supports comma split)
          if (param.type === "text") {
            return (
              <input
                key={i}
                type="text"
                placeholder={param.label}
                className="operation-panel-select"
                onChange={(e) => {
                  const value = e.target.value;

                  setParams((prev) => ({
                    ...prev,
                    [param.name]: value.includes(",")
                      ? value.split(",").map((v) => v.trim())
                      : value,
                  }));
                }}
              />
            );
          }

          // Select Input
          if (param.type === "select") {
            return (
              <select
                key={i}
                className="operation-panel-select"
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    [param.name]: e.target.value,
                  }))
                }
              >
                <option value="">Select {param.label}</option>
                {param.options.map((opt, j) => (
                  <option key={j} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            );
          }

          return null;
        })}
      </div>
    );
  };

  // Apply Action
  const handleApply = async () => {
    if (!operation || !subOperation || selectedColumns.length === 0) return;

    await onAnalyze?.({
      columns: selectedColumns.filter(Boolean),
      operation,
      sub_operation: subOperation,
      params,
    });
  };

  return (
    <div className="operation-panel">
      <h2 className="operation-panel-title">Feature Engineering</h2>

      {/* Columns */}
      <label>Select Columns (Max 3)</label>
      {renderColumnSelect(0)}
      {renderColumnSelect(1)}
      {renderColumnSelect(2)}

      {/* Operation */}
      <label>Select Operation</label>
      <select
        className="operation-panel-select"
        value={operation}
        onChange={(e) => {
          const value = e.target.value;
          setOperation(value);
          setSubOperation("");
          setParams({});
          setSelectedOpObj(
            featureOps.find((o) => o.value === value)
          );
        }}
      >
        <option value="">Select Operation</option>
        {featureOps.map((op, i) => (
          <option key={i} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {/* Sub Operation */}
      {selectedOp && (
        <>
          <label>Select Method</label>
          <select
            className="operation-panel-select"
            value={subOperation}
            onChange={(e) => {
              setSubOperation(e.target.value);
              setParams({});
            }}
          >
            <option value="">Select Method</option>
            {selectedOp.options.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Params */}
      {renderParams()}

      {/* Apply */}
      <button className="operation-panel-button" onClick={handleApply}>
        Apply
      </button>

      {/* Description */}
      <div className="op-box">
        <h3>What will happen</h3>
        {selectedOpObj && <p>{selectedOpObj.desc}</p>}
      </div>
    </div>
  );
}

export default OperationPanel;