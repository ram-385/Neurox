import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import './Info.css'

function Info({ info = {}, onSave }) {

  const [model_id, setModeld_id] = useState(null)

  const dummyInfo = {
    model: "Random Forest",
    task: "Classification",
    metrics: {
      Accuracy: 0.9123,
      R2Score: 0.8765
    },
    training_time: 1.24
  }

  const activeInfo =
    info && Object.keys(info).length > 0
      ? info
      : dummyInfo

  const handleSave = async () => {

    if (!onSave) return

    const result = await onSave()

    if (result?.model_id) {
      setModeld_id(result.model_id)
    }
  }

  return (

    <div className="information-box">

      <div className="information">
        <span>Model Name</span>
        <h4>{activeInfo.model}</h4>
      </div>

      <div className="information">
        <span>
          {activeInfo.task === "Classification"
            ? "Accuracy"
            : "R2 Score"}
        </span>

        <h4>
          {
            activeInfo.task === "Classification"
              ? activeInfo.metrics?.Accuracy?.toFixed(4)
              : activeInfo.metrics?.R2Score?.toFixed(4)
          }
        </h4>
      </div>

      <div className="information">
        <span>Training Time</span>
        <h4>{activeInfo.training_time} Sec</h4>
      </div>

      {model_id && (
        <div className="information">
          <span>Model Id</span>
          <h4>{model_id}</h4>
        </div>
      )}

      <div className="information action-btn">

        <FontAwesomeIcon icon={faDownload} />

        <button onClick={handleSave}>
          Save & Predict
        </button>

      </div>

    </div>
  )
}

export default Info