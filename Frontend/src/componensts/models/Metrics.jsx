import React from 'react'
import './Metrics.css'
import { RegressionMetrics, ClassificationMetrics } from './Metric.js'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Progress from '../../assets/modeling-assets/progress.png'

function Metrics({ value, task }) {

  const dummyClassification = {
    Accuracy: 0.9123,
    Precision: 0.8934,
    Recall: 0.9012,
    "F1-Score": 0.8978
  }

  const dummyRegression = {
    MAE: 2.1234,
    MSE: 5.4567,
    RMSE: 2.3359,
    R2Score: 0.8765
  }

  const activeTask = task || "Classification"

  const activeValue =
    value && Object.keys(value).length > 0
      ? value
      : activeTask === "Regression"
      ? dummyRegression
      : dummyClassification

  let activeMetrics = []

  if (activeTask === "Regression") {
    activeMetrics = RegressionMetrics
  } else {
    activeMetrics = ClassificationMetrics
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
                {activeValue?.[m.value] !== undefined
                  ? Number(activeValue[m.value]).toFixed(4)
                  : "--"}
              </strong>

              <img
                src={Progress}
                alt="progress"
                className='progress'
              />

            </div>

            <h3 className='metric-desc'>
              {m.desc}
            </h3>

          </li>
        ))}

      </ul>

    </div>
  )
}

export default Metrics