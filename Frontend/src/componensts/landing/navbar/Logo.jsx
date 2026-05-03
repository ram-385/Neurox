import React,{forwardRef} from 'react'
import './logo.css'
function Logo({ src, alt = "logo" , className='', ...props},ref) {
  return (
    <div className="logo-container">
      <img
        ref = {ref}
        src={src}
        alt={alt}
        className={`logo-img ${className}`}
        {...props}
      />
    </div>
  )
}

export default forwardRef(Logo)