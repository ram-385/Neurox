import React, { forwardRef } from "react";
import "./AuthCard.css";

function Card(
  { children, className = "", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`auth_card ${className}`}
      {...props}
    >
      <div className="auth_card__content">
        {children}
      </div>
    </div>
  );
}

export default forwardRef(Card);