import React from 'react'
import './Metrics.css'
import { RegressionMetrics, ClassificationMetrics } from './Metric.js'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Progress from '../../assets/modeling-assets/progress.png';

function Metrics({ value, task }) {

  let activeMetrics = [];

  if (task === "Regression") {
    activeMetrics = RegressionMetrics;
  } else if (task === "Classification") {
    activeMetrics = ClassificationMetrics;
  }

  return (
    <div className="metric-card">

      <ul className="metric-list">
        {activeMetrics.map((m) => (
         
          <li key={m.value}>

           
            <div className='icon-head'>
              <FontAwesomeIcon icon={m.icon} />
              <span>{m.label}</span>
            </div>

            
            <div className='metric-value'>
              <strong>
                {value?.[m.value] !== undefined
                  ? Number(value[m.value]).toFixed(4)
                  : "--"}
              </strong>
                <img
                src={Progress}
                alt="progress"
                className='progress'
              />

            </div>

            <h3 className='metric-desc'>{m.desc}</h3>

          </li>
        ))}
      </ul>
    </div>
  )
}

export default Metrics