import React ,{forwardRef}from 'react'
import './AuthBtn.css'

function Btn(
    {
    children,
    type = "button",
    disabled = false,
    loading = false,
    className = "",
    ...props
  },ref
) {
  return (
        <button
        ref = {ref}
        type = {type}
        disabled={disabled||loading}
        className={`auth-btn-grad ${className}`}
        {...props}
        >
       {loading ? "Loading....": children}
        </button>
  )
}

export default forwardRef(Btn)