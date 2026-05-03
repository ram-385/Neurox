import React, { useState, useEffect } from "react";

import ColumnPanel from "../../componensts/explore/columnPanel/ColumnPanel.jsx";
import ActionPanel from "../../componensts/explore/actionPanel/ActionPanel";
import Preview from "../../componensts/explore/PreviewPanel/Preview";
import SelectionBox from "../../componensts/explore/analysis/SelectionBox.jsx";
import Chart from "../../componensts/explore/analysis/Chart.jsx";
import OperationPanel from "../../componensts/explore/operationPanel/OperationPanel.jsx";
import "./Explore.css";

function Explore() {

  // DATASET INFO (STATIC HEADER)

  const dataset = {
    name: "file.csv",
    rows: 0,
    columns: 0,
    size: "unknown"
  };


  // Global State

  const [datasetId, setDatasetId] = useState(null);
  const [data, setData] = useState([]);           // table preview
  const [columns, setColumns] = useState([]);     // column list
  const [stats, setStats] = useState(null);       // stat result
  const [analysisConfig, setAnalysisConfig] = useState(null);


  // Load from local storage  (after upload)

  useEffect(() => {
    const id = localStorage.getItem("dataset_id");
    const preview = localStorage.getItem("Data");
    const cols = localStorage.getItem("columns");
    
    if (id) setDatasetId(id);
    if (preview) {
      const parsed = JSON.parse(preview);
      
      setData({
        type: "table",
        data: parsed
      });
    }
     if (cols && columns.length === 0) {
    setColumns(JSON.parse(cols));
  }
  }, []);


  // Analysis Handler

 const handleAnalyze = async (config) => {
  const { column, operation, category } = config;
   setAnalysisConfig(config);

  let url = "";
  let body = { dataset_id: datasetId };

  if (category === "analysis") {
    url = "/column-stats";
    body.column = column;
    body.operation = operation;
  }

  else if (category === "cleaning") {

    if (operation === "fill_mean") {
      url = "/fill-na";
      body.column = column;
      body.strategy = "mean";
    }

    else if (operation === "fill_median") {
      url = "/fill-na";
      body.column = column;
      body.strategy = "median";
    }

    else if (operation === "fill_mode") {
      url = "/fill-na";
      body.column = column;
      body.strategy = "mode";
    }

    else if (operation === "drop_missing") {
      url = "/drop-na";
      body.column = column;
    }

    else if (operation === "remove_duplicates") {
      url = "/delete-duplicates-column";
      body.column = column;
    }
  }

  else if (category === "view") {
    url = "/preview-operation";
    body.operation = operation;
  }

  if (!url) return;

  try {
    const res = await fetch(`http://127.0.0.1:8000/api${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    
    if (result.error) {
      return result.error;   
    }

   
    if (category === "analysis") {
      setStats(result.result);
      return result.result; 
    }

   
    if (category === "cleaning" && result.data) {
      setData({
        type: "table",
        data: result.data,
      });
       setAnalysisConfig(config);
      setColumns(result.columns);

      localStorage.setItem("Data", JSON.stringify(result.data));
      localStorage.setItem("columns", JSON.stringify(result.columns));

      return result.message;   
    }

    
    if (category === "view" && result.data) {
      setData({
        type: "table",
        data: result.data,
      });

      return result.data;  
    }

  } catch (err) {
    console.error("Operation error:", err);
    return "Server error"; 
  }
};

console.log(data)
console.log(columns)

  
  const handleAction = async (action, column) => {
  try {
    let url = "";
    let body = { dataset_id: datasetId };

    if (action === "delete_column") {
      url = "/delete_column";
      body.column_name = column;
    }

    if (action === "rename_column") {
      url = "/rename-column";
      body.old_name = column.old;
      body.new_name = column.new;
    }

    if (!url) return;

    const res = await fetch(`http://127.0.0.1:8000/api${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await res.json();

   
    if (result.data) {
      setData({
        type: "table",
        data: result.data   
      });

      // sync localStorage also
      localStorage.setItem("Data", JSON.stringify(result.data));
    }

    if (result.columns) {
  setColumns(prev => {
    console.log("NEW COLUMNS:", result.columns);
    return result.columns;
  });

  localStorage.setItem("columns", JSON.stringify(result.columns));
}

  } catch (err) {
    console.error("Action error:", err);
  }
};


  return (
    <div>
      
      <ActionPanel />

      <div className="explore-layout">

       
        <div className="left-panel">
          <ColumnPanel columns={columns} onAction={handleAction} />
        </div>

       
        <div className="center-panel">

          
          <Preview Data={data} />

         
          <div className="analysis-box">

            <SelectionBox
              columns={columns}
              Data={data.data}
              onAnalyze={handleAnalyze}
            />
            <Chart
              config={analysisConfig}
              data={data.data}
            />
          </div>
        </div>

       
        <div className="right-panel">
          <OperationPanel
            columns={columns}
            onAnalyze={handleAnalyze}
          />
        </div>

      </div>
    </div>
  );
}

export default Explore;


