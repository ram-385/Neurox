import React, { useState } from "react";
import ColumnItem from "./ColumnItem";
import "./columnPanel.css";

function ColumnPanel({columns=[],onAction}) {
  

  const [selectedColumn, setSelectedColumn] = useState(null);
  const [search, setSearch] = useState("");


  const filteredColumns = columns.filter((col) =>
  (col?.name || "").toLowerCase().includes((search || "").toLowerCase())
);


  return (
    <div className="column-panel">

      {/* Header */}
      <div className="panel-header">
        <h3>Columns</h3>
        <span>{columns.length}</span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search column..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Column List */}
      <div className="column-list">
        {filteredColumns.map((col, index) => (
          <ColumnItem
            key={index}
            column={col}
            selected={selectedColumn === col.name}
            onSelect={setSelectedColumn}
            onAction={onAction}   
          />
        ))}
      </div>

    </div>
  );
}

export default ColumnPanel;