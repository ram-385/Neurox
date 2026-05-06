import React, { useState } from "react";
import "./Training.css";
import { models } from "./Models.js";

function Training({ columns = [], onTrain }) {

  const [target, setTarget] = useState("");
  const [task, setTask] = useState("");
  const [model, setModel] = useState("");
  const [testSize, setTestSize] = useState(20);

  const selectedModel = models.find(m => m.value === model);

  const handleTrain = () => {
    if (!target || !task || !model) return;

    const payload = {
      target,
      task,
      model,
      test_size: testSize / 100
    };

    console.log("Training Payload:", payload);

    if (onTrain) onTrain(payload);
  };

  return (
    <div className="training-box">

      <h3 className="training-title">Model Training</h3>

      
      <select
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      >
        <option value="">Select Target Column</option>
        {columns.map((col, i) => (
          <option key={i} value={col.name}>
            {col.name}
          </option>
        ))}
      </select>

     
      <select
        value={task}
        onChange={(e) => setTask(e.target.value)}
      >
        <option value="">Select Task</option>
        <option value="classification">Classification</option>
        <option value="regression">Regression</option>
      </select>

     
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        <option value="">Select Model</option>
        {models.map((m, i) => (
          <option key={i} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <div className="model-desc">
          <h4 style={{color:'#00ffaa'}}>Algorithm's Description</h4>
      {selectedModel && (
        <div >
          <p>{selectedModel.desc}</p>
        </div>
       )}
      </div>

     
      <div className="slider-box">
        <label>Test Size: {testSize}%</label>
        <input
          type="range"
          min="5"
          max="50"
          step="5"
          value={testSize}
          onChange={(e) => setTestSize(e.target.value)}
        />
      </div>

     
      <button onClick={handleTrain}>
        Start Training
      </button>

    </div>
  );
}

export default Training;