import React from 'react'
import './Metrics.css'
import { RegressionMetrics, ClassificationMetrics } from './metric'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Metrics({ value, metrics }) {

  let activeMetrics = [];

  if (metrics === "Regression") {
    activeMetrics = RegressionMetrics;
  } else if (metrics === "Classification") {
    activeMetrics = ClassificationMetrics;
  }

  return (
    <div className="metric-card">

      <ul className="metric-list">
        {activeMetrics.map((m) => (
          <li key={m.value}>
             <div className='icon-head'>
               <FontAwesomeIcon icon={m.icon} />
               <span style ={{ color: '#47add9' }}>{m.label}</span>
             </div>

            <strong>
              {value?.[m.value] !== undefined
                ? Number(value[m.value]).toFixed(4)
                : "--"}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Metrics