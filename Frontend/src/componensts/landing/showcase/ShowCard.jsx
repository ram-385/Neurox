import React from 'react'
import './ShowCard.css'

function ShowCard({ img, alt, child }) {
    return (
        <div className="card">
            <div>
               {child}
            </div>

            <div className="card-img">
                <img src={img} alt={alt} />
            </div>
        </div>
    )
}

export default ShowCard