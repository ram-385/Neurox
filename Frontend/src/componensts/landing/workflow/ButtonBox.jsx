import React from "react";
import "./ButtonBox.css";

function ButtonBox({ text }) {
  return (
    <div className="btn-box">
      <span>{text}</span>

      <div className="arrow">
        →
      </div>
    </div>
  );
}

export default ButtonBox;