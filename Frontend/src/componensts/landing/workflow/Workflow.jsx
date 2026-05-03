import React from 'react'
import './Workflow.css'
import ButtonBox from './ButtonBox'

function Workflow() {
  return (
    <div>
      <h2 className='workflow-title'><span>How it works</span></h2>
        <div className='workflow-container'>
            <ButtonBox text = " Upload your Dataset"/>
             <ButtonBox text = " Preprocessing & Feature Engineering"/>
            <ButtonBox text = "Train the Model "/>
            <ButtonBox text = " Evaluation & Hyperparameter Tuning"/>
            <ButtonBox text = "Deployment"/>
        </div>

    </div>
  )
}

export default Workflow