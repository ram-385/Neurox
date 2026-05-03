import React, { useState } from "react";
import ActionCard from "./ActionCard";
import actions from "./Actions";
import './ActionPanel.css'

function ActionPanel() {
  const [activeAction, setActiveAction] = useState(null);

  const handleAction = (actionId) => {
    setActiveAction(actionId);
    console.log("Selected action:", actionId);
  };

  return (
    <div className="action-panel">
      {actions.map((action) => (
        <ActionCard
          key={action.id}
          action={action}
          onClick={handleAction}
        />
      ))}
    </div>
  );
}

export default ActionPanel;