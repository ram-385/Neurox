import React, { useState, useEffect } from 'react'
import './Model.css'

import Metrics from '../../componensts/models/Metrics'
import Training from '../../componensts/models/Training'
import Info from '../../componensts/models/Info'
import Performance from '../../componensts/models/Performance'

function Model() {

  const [datasetId, setDatasetId] = useState(null)
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [metricsData, setMetricsData] = useState(null)
  const [info, setInfo] = useState({})
  const [performanceData, setPerformanceData] = useState([])

  useEffect(() => {

    const id = localStorage.getItem("dataset_id")
    const Data = localStorage.getItem("Data")
    const cols = localStorage.getItem("columns")

    if (id) {
      setDatasetId(id)
    }

    if (Data) {
      const parsed = JSON.parse(Data)

      setData({
        type: "table",
        data: parsed
      })
    }

    if (cols) {
      setColumns(JSON.parse(cols))
    }

  }, [])



  const getPerformance = async (payloadData) => {

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/api/performance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadData)
      }
    )

    const result = await response.json()

    console.log("Performance Result:", result)

    if (result.error) {
      console.error(result.error)
      return
    }

    setPerformanceData(result.performance)

  } catch (error) {
    console.error(error)
  }
}


  const getResults = async (payload) => {

    if (!datasetId) {
      console.error("No dataset found.")
      return
    }

    const updatedPayload = {
      ...payload,
      dataset_id: datasetId
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/train",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedPayload)
        }
      )

      const result = await response.json()

      if (result.error) {
        console.error(result.error)
        return
      }

      setMetricsData(result.metrics)
      setInfo(result)

      await getPerformance(updatedPayload)

      return result

    } catch (error) {
      console.error(error)
    }
  }



  const handleSave = async () => {

    if (!info.model_id) {
      console.error("No model found.")
      return
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/save-model",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model_id: info.model_id
          })
        }
      )

      const result = await response.json()

      if (result.error) {
        console.error(result.error)
        return
      }

      return result

    } catch (error) {
      console.error(error)
    }
  }



  return (
    <div className="model">

      <div className='box'>

        <Training
          columns={columns}
          onTrain={getResults}
        />

        <div className='center'>

          <Metrics
            value={metricsData}
            task={info.task}
          />

          <div className='graph-wrapper'>

            <div className='graph'>

              <Performance
                data={performanceData}
              />

            </div>

            <button className='toggle-btn'>
              Performance
            </button>

          </div>

          <Info
            info={info}
            onSave={handleSave}
          />

        </div>

      </div>

    </div>
  )
}

export default Model