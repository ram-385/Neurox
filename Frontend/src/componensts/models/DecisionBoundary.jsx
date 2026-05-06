import React from "react";
import Plot from "react-plotly.js";

const PlotComponent = Plot?.default || Plot;

function DecisionBoundary() {

  const size = 60;

  const xRange = Array.from({ length: size }, (_, i) => i / 5);
  const yRange = Array.from({ length: size }, (_, i) => i / 5);

  const Z = xRange.map((x, i) =>
    yRange.map((y, j) => (x + y > 10 ? 1 : 0))
  );

  const points = {
    x: [1, 2, 3, 4, 5, 6, 7],
    y: [1, 2, 1.5, 3.5, 2.5, 4, 5],
    labels: [0, 0, 1, 1, 0, 1, 1]
  };

  const plotData = [

    
    {
      z: Z,
      x: xRange,
      y: yRange,
      type: "contour",
      colorscale: "RdBu",
      opacity: 0.5,
      showscale: false,
      contours: {
        coloring: "heatmap"
      }
    },

   
    {
      x: points.x,
      y: points.y,
      mode: "markers",
      type: "scatter",
      marker: {
        color: points.labels,
        colorscale: "Viridis",
        size: 9,
        line: {
          color: "#0b1220",
          width: 1
        }
      }
    }
  ];

  const layout = {
    title: "Decision Boundary",
    autosize: true,
     paper_bgcolor: "#0f172a",
    plot_bgcolor: "#0f172a",

    font: {
      color: "#e6f1ff"
    },

    xaxis: {
      title: "Feature 1",
      gridcolor: "#1f2a4a"
    },

    yaxis: {
      title: "Feature 2",
      gridcolor: "#1f2a4a"
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <PlotComponent
        data={plotData}
        layout={layout}
        config={{ responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default DecisionBoundary;