import React, { forwardRef } from "react";
import "./input.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Input(
  {
    label,
    type = "text",
    placeHolder = "Enter value",
    error,
    className = "",
    handlEyeClick,
    ...props
  },
  ref
) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}

      <div className={`input ${className}`}>
        <input
          ref={ref}
          placeHolder={placeHolder}
          type={type}
          {...props}
        />
       {(type === "password") && (
  <FontAwesomeIcon
    icon={type === "password" ? faEye : faEyeSlash}
    onClick={handlEyeClick}
  />
)}
      </div>

      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

export default forwardRef(Input);