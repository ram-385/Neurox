import React from "react";
import Plot from "react-plotly.js";
import './Chart.css'

const PlotComponent = Plot?.default || Plot;



function kernelDensity(x, data) {
  const n = data.length;

  const mean = data.reduce((a, b) => a + b, 0) / n;

  const variance =
    data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;

  const bandwidth = 1.06 * Math.sqrt(variance) * Math.pow(n, -1 / 5);

  const sum = data.reduce((acc, xi) => {
    const u = (x - xi) / bandwidth;
    return acc + Math.exp(-0.5 * u * u);
  }, 0);

  return sum / (n * bandwidth * Math.sqrt(2 * Math.PI));
}






function Chart({ config, data }) {

  if (!config || !config.column || !data) {
    return <div style={{ color: "#aaa" }}>Select column & operation</div>;
  }

  const { column, operation, type } = config;

  const values = data
    .map((row) => row[column])
    .filter((v) => v !== undefined && v !== null);

  if (values.length === 0) {
    return <div style={{ color: "#aaa" }}>No data available</div>;
  }

  // CATEGORICAL COUNTS
  const getCounts = () => {
    const counts = {};
    values.forEach((v) => {
      counts[v] = (counts[v] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      freq: Object.values(counts),
    };
  };

  // COMMON LAYOUT
  const layout = (titleText) => ({
    title: {
      text: titleText,
      x: 0.5,
      font: { size: 18 },
    },
    paper_bgcolor: "#0a0f2c",
    plot_bgcolor: "#0a0f2c",
    font: { color: "#e6f1ff" },

    height: 350,
    margin: { t: 40, l: 40, r: 20, b: 40 },
  });

  // NUMERICAL CHARTS
  const renderNumerical = () => {
    switch (operation) {

    
      case "histogram":
        return (
          <PlotComponent
            data={[
              {
                x: values,
                type: "histogram",

                nbinsx: Math.ceil(Math.sqrt(values.length)), 
                marker: {
                  line: {
                    width: 1
                  }
                },
                opacity: 0.8
              },
            ]}
            layout={layout(`Histogram of ${column}`)}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        );

      case "boxplot":
        return (
          <PlotComponent
            data={[
              {
                y: values,
                type: "box",

                boxpoints: "all", 
                jitter: 0.3,
                pointpos: 0
              },
            ]}
            layout={layout(`Box Plot of ${column}`)}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        );




      case "kde": {
  const sorted = [...values].sort((a, b) => a - b);

  const min = Math.min(...sorted);
  const max = Math.max(...sorted);

  // KDE smooth x-axis
  const x = Array.from({ length: 100 }, (_, i) =>
    min + (i * (max - min)) / 99
  );

  const y = x.map((xi) => kernelDensity(xi, sorted));

  return (
    <PlotComponent
      data={[
  
        {
          x: values,
          type: "histogram",
          histnorm: "probability density",
          nbinsx: Math.ceil(Math.sqrt(values.length)),
          opacity: 0.6,
          marker: {
            line: { width: 1 },
          },
        },

        {
          x,
          y,
          type: "scatter",
          mode: "lines",
          line: { width: 2, color: "#ff4d4f" },
        },
      ]}
      layout={{
        ...layout(`Histogram + KDE of ${column}`),
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
    />
  );
}


      case "line":
        return (
          <PlotComponent
            data={[
              {
                x: values.map((_, i) => i),
                y: values,
                type: "scatter",
                mode: "lines",
              },
            ]}
            layout={layout(`Line Plot of ${column}`)}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        );

      default:
        return <div style={{ color: "#aaa" }}>Invalid numerical operation</div>;
    }
  };

  // CATEGORICAL CHARTS
  const renderCategorical = () => {
    const { labels, freq } = getCounts();

    switch (operation) {
      case "bar":
      case "count":
        return (
          <PlotComponent
            data={[{ x: labels, y: freq, type: "bar" }]}
            layout={layout(
              `${operation === "bar" ? "Bar Chart" : "Count Plot"} of ${column}`
            )}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        );

      case "pie":
        return (
          <PlotComponent
            data={[{ labels, values: freq, type: "pie" }]}
            layout={layout(`Pie Chart of ${column}`)}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        );

      case "donut":
        return (
          <PlotComponent
            data={[{ labels, values: freq, type: "pie", hole: 0.4 }]}
            layout={layout(`Donut Chart of ${column}`)}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        );

      default:
        return <div style={{ color: "#aaa" }}>Invalid categorical operation</div>;
    }
  };

  return (
    <div className="chart-container" style={{ marginTop: "20px" }}>
      {type === "numerical" ? renderNumerical() : renderCategorical()}
    </div>
  );
}

export default Chart;