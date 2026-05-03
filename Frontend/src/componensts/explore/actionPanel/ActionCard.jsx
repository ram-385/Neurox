import React from "react";
import './ActionCard.css'
import iconMap from "./IconMap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ActionCard({ action, onClick }) {
  return (
    <div className="action-box">
      <div className="action-bar">
        <div className="icon-squre">
            <FontAwesomeIcon icon={iconMap[action.icon]} />
        </div>

        <div className="Action">
          <h2>{action.name}</h2>
          <p>{action.text}</p>
        </div>
      </div>

      <div className="ActionBtn">
        <button onClick={() => onClick(action.id)}>
          {action.btn_text}
        </button>
      </div>
    </div>
  );
}

export default ActionCard;