import React,{useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload  } from '@fortawesome/free-solid-svg-icons'
import './Info.css'


function Info({info,onSave}) {
  const [model_id ,setModeld_id] =useState(null)
 const handleSave = async () => {
  const result = await onSave();

  if (result?.model_id) {
    setModeld_id(result.model_id);
  }
};
  return (
    <div className="information-box">

  <div className="information">
    <span>Model Name</span>
    <h4>{info.model}</h4>
  </div>

  <div className="information">
    <span>Accuracy</span>
    <h4>{ 
    info.task === "Classification"
      ? info.metrics?.Accuracy
      : info.metrics?.R2Score
  }</h4>
  </div>

  <div className="information">
    <span>Training Time</span>
    <h4>{info.training_time} Sec</h4>
  </div>
 
    {model_id && (
      <div className="information">
      <span>Model Id</span>
      <h4>{model_id}</h4>
    </div>
    )}


  <div className="information action-btn">
    <FontAwesomeIcon icon={faDownload} />
    <button
    onClick={handleSave}
    >Save & Predict</button>
  </div>

</div>
  )
}

export default Info