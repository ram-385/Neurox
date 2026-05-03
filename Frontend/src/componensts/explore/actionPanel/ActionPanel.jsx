import React, { useState } from "react";
import ActionCard from "./ActionCard";
import './ActionPanel.css'
import actions from "./Actions";
import "./ActionPanel.css";

import FilterBox from "./FilterBox";
import SortBox from "./SortBox";
import GroupBox from "./GroupBox";

function ActionPanel({ handleAction, columns }) {

  const [activeAction, setActiveAction] = useState(null);

  const handleClick = (id) => {
    setActiveAction(id);
  };

  return (
    <div className="action-panel">

        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            isActive={activeAction === action.id}
            onClick={handleClick}
          />
        ))}
      

      
      <div className="action-form">

        {activeAction === "filter" && (
          <FilterBox columns={columns} onApply={handleAction} />
        )}

        {activeAction === "sort" && (
          <SortBox columns={columns} onApply={handleAction} />
        )}

        {activeAction === "group" && (
          <GroupBox columns={columns} onApply={handleAction} />
        )}

      </div>
    </div>
  );
}

export default ActionPanel;