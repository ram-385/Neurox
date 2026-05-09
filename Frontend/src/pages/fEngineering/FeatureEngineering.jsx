import React, { useEffect, useState } from 'react';
import ColumnPanel from '../../componensts/explore/columnPanel/ColumnPanel';
import Preview from '../../componensts/explore/PreviewPanel/Preview.jsx';
import OperationPanel from '../../componensts/featureEngineering/OperationPanel.jsx';
import './FeatureEngineering.css';
import SelectionBox from '../../componensts/featureEngineering/Selection.jsx';
import Graph from '../../componensts/featureEngineering/Graph.jsx';

function FeatureEngineering() {

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [datasetId, setDatasetId] = useState(null); 
   const [graphConfig, setGraphConfig] = useState(null);
  

  
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

const handleOperation = async (Payload) => {
  try {
    const body = {
      dataset_id: datasetId,
      type: Payload.operation,          
      operation: Payload.sub_operation, 
      columns: Payload.columns,
      params: Payload.params || {}
    };
    console.log("Operation Payload:", body);

    const res = await fetch(
      "http://127.0.0.1:8000/api/feature-engineering/FeatureEngineering",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const result = await res.json();

    console.log("FE Result:", result);

    if (result.data) {
      setData({
        type: "table",
        data: result.data
      });

      localStorage.setItem("Data", JSON.stringify(result.data));
    }

    if (result.columns) {
      setColumns(result.columns);

      localStorage.setItem("columns", JSON.stringify(result.columns));
    }

  } catch (err) {
    console.error("Feature Engineering Error:", err);
  }
};



  return (
    <div className='feature-engineering-container'>

      <ColumnPanel 
        columns={columns} 
        onAction={handleAction}  
      />

      <div className="center" >
        
         
            <Preview Data={data} />
         
         <div className='analysis'>
           <SelectionBox 
            columns={columns}
            onPlot={setGraphConfig}
          />

           {!graphConfig ? (
            <div className="analysis-empty">
              Select columns and click Plot
            </div>
          ) : (
            <Graph 
              config={graphConfig}
              data={data}
              columns={columns}
            />
          )}
          
          
         </div>

      </div>

      <div className="right">
        <OperationPanel 
          columns={columns}
          onAnalyze={handleOperation}
        />
      </div>

    </div>
  );
}

export default FeatureEngineering;