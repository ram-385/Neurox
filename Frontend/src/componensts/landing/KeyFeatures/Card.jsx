import React from 'react'
import './Card.css'

function Card({ img, title, desc }) {
  return (
    <div className="Card">

      <div className="Card-img">
        <img src={img} alt={title} />
      </div>

      <div className="Card-content">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>

    </div>
  )
}

export default Card