import React  from "react";
import './ActionCard.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFilter,
  faSort,
  faLayerGroup,
  faBroom,
  faCode,
  faChartBar
} from "@fortawesome/free-solid-svg-icons";
import iconMap from "./IconMap";
function ActionCard({ action, onClick, isActive }) {
  return (
    <div
      className={`action-box ${isActive ? "active" : ""}`}
      onClick={() => onClick(action.id)}
    >
      <div className="action-bar">
        <div className="icon-squre">
          <FontAwesomeIcon icon={iconMap[action.icon]} />
        </div>

        <div className="Action">
          <h2>{action.name}</h2>
          <p>{action.text}</p>
        </div>
      </div>

      <button className="action-btn">
        {action.btn_text}
      </button>
    </div>
  );
}
 export default ActionCard;