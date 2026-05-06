import React from 'react'
import './Model.css'
import Metrics from '../../componensts/models/Metrics'
import Training from '../../componensts/models/Training'
import DecisionBoundary from '../../componensts/models/DecisionBoundary'

function Model() {


const metricsData = {
  MAE: 4.5,
  MSE: 20.25,
  RMSE: 4.5,
  R2Score: 0.85
}
  return (
    <div className="model">
      <div className='box'>
        <Training columns={[]} onTrain={() => {}} />
       <div className='center'>
         <Metrics value={metricsData} metrics="Regression"/>
          <div className='graph'>
             <DecisionBoundary /> 
          </div>
       </div>
      </div>
      <div className="infobox">
        <p>Model Information</p>
      </div>
    </div>
  )
}

export default Model