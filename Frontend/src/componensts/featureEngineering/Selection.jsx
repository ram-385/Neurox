import React, { useState, useEffect } from "react";
import "./Selection.css";
import { getSuggestedPlots } from "./Graph.js";

function Selection({ columns, onPlot }) {
  const [col1, setCol1] = useState("");
  const [col2, setCol2] = useState("");
  const [plotType, setPlotType] = useState("");
  const [suggestedPlots, setSuggestedPlots] = useState([]);

  useEffect(() => {
    const selected = columns.filter(
      (c) => c.name === col1 || c.name === col2
    );

    if (selected.length > 0) {
      const plots = getSuggestedPlots(selected);
      setSuggestedPlots(plots);
      setPlotType(plots[0] || "");
    }
  }, [col1, col2, columns]);

  //  handle plot
  const handlePlot = () => {
    if (!col1 || !plotType) return;

    onPlot({
      type: plotType,
      x: col1,
      y: col2 || null,

      z: null,
      color: null,
      title: `${plotType} Plot`,
      bins: 20,

    columns: columns
    });
  };

  return (
    <div className="fselection-box">

      <h3>Analysis Controls</h3>

      {/* Column 1 */}
      <select
        value={col1}
        onChange={(e) => {
          setCol1(e.target.value);
          setCol2(""); // reset second column
        }}
      >
        <option value="">Select Column 1</option>
        {columns.map((col, i) => (
          <option key={i} value={col.name}>
            {col.name}
          </option>
        ))}
      </select>

      {/* Column 2 */}
      {col1 && (
        <select
          value={col2}
          onChange={(e) => setCol2(e.target.value)}
        >
          <option value="">Select Column 2 (optional)</option>
          {columns
            .filter((c) => c.name !== col1)
            .map((col, i) => (
              <option key={i} value={col.name}>
                {col.name}
              </option>
            ))}
        </select>
      )}

      {/* Plot Type */}
      {suggestedPlots.length > 0 && (
        <select
          value={plotType}
          onChange={(e) => setPlotType(e.target.value)}
        >
          {suggestedPlots.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}
        </select>
      )}

      {/* BUTTON */}
      <button onClick={handlePlot}>
        Plot
      </button>

    </div>
  );
}

export default Selection;