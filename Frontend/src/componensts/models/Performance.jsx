import React, { useMemo } from "react";
import Plot from "react-plotly.js";

const PlotComponent = Plot?.default || Plot;

function Performance({ data = [] }) {

  const dummyData = [
    {
      model: "Random Forest",
      metric: "Accuracy",
      score: 0.91
    },
    {
      model: "SVM",
      metric: "Accuracy",
      score: 0.87
    },
    {
      model: "Logistic Regression",
      metric: "Accuracy",
      score: 0.84
    },
    {
      model: "Decision Tree",
      metric: "Accuracy",
      score: 0.80
    }
  ];


  const plotData = useMemo(() => {

    const safeData =
      Array.isArray(data) && data.length > 0
        ? data
        : dummyData;

    const filtered = safeData.filter(
      item => item.metric !== "Error"
    );

    return {

      traces: [
        {
          type: "bar",

          x: filtered.map(item => item.model),

          y: filtered.map(item => item.score),

          text: filtered.map(
            item => Number(item.score).toFixed(4)
          ),

          textposition: "auto",

          marker: {
            color: "#00ffaa"
          }
        }
      ],

      layout: {

        title: {
          text: "Model Performance Comparison",
          font: {
            color: "#ffffff"
          }
        },

        paper_bgcolor: "#0f1932",
        plot_bgcolor: "#0f1932",

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

        yaxis: {

          title: {
            text: filtered[0]?.metric || "Score",
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

        font: {
          color: "#ffffff"
        },

        height: 400
      }
    };

  }, [data]);



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

        config={{
          displayModeBar: false,
          responsive: true
        }}
      />

    </div>
  );
}

export default Performance;