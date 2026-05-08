import React, { useMemo } from "react";
import Plot from "react-plotly.js";

const PlotComponent = Plot?.default || Plot;

function Performance({ data = [] }) {

  const plotData = useMemo(() => {

    const safeData = Array.isArray(data) ? data : [];

    if (safeData.length === 0) {
      return {
        traces: [],
        layout: {}
      };
    }

    const filtered = safeData.filter(
      item => item.metric !== "Error"
    );

    return {
      traces: [
        {
          type: "bar",
          x: filtered.map(item => item.model),
          y: filtered.map(item => item.score),
          text: filtered.map(item => item.score),
          textposition: "auto"
        }
      ],

      layout: {
        title: "Model Performance Comparison",
          xaxis: {
              title: {
                  text: "Models",
                  font: {
                      color: "#ffffff"
                  }
              },
              tickfont: {
                  color: "#ffffff"
              },
              showgrid: false,
              zeroline: false
          },
         paper_bgcolor: "#0f1932",
         plot_bgcolor: "#0f1932",

        yaxis: {
          title: filtered[0]?.metric || "Score"
        },
        height: 300
      }
    };

  }, [data]);



  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        No performance data available
      </div>
    );
  }



  return (
    <div
      className="graph-container"
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <PlotComponent
        data={plotData.traces}
        layout={plotData.layout}
        style={{
          width: "100%",
          height: "100%"
        }}
        useResizeHandler={true}
      />
    </div>
  );
}

export default Performance;