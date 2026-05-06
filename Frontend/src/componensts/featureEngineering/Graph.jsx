import React from "react";
import Plot from "react-plotly.js";
import "./Graph.css";

const PlotComponent = Plot?.default || Plot;

function Graph({ config, data }) {
  if (!config || !data || data.length === 0) return null;

  const {
    type,
    x,
    y,
    z = null,
    color = null,
    bins = 20,
    columns = []
  } = config || {};
  const xLabel = config.x || "";
  const yLabel = config.y || "";
  const title = config.title || "";

  let plotData = [];

  let layout = {
     title: {
    text: title || "",
    font: {
      size: 18,
      color: "#e6f1ff"
    },
    x: 0.5,   // center title
    xanchor: "center"
  },
    autosize: true,
    paper_bgcolor: "#0f172a",
    plot_bgcolor: "#0f172a",
    font: { color: "#e6f1ff" },
    height: undefined,
    xaxis: {
    title: {
      text: xLabel || ""
    }
  },
  yaxis: {
    title: {
      text: yLabel || ""
    }
  }
  };

  const getColumn = (col) => data.data.map((d) => d[col]);
  

  const getCounts = (col) => {
    const counts = {};
    data.data.forEach((d) => {
      const val = d[col];
      counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
  };

  const getNumericColumns = () =>
    columns?.filter((c) => c.type === "numerical").map((c) => c.name) || [];

  
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
  switch (type) {

    //Histogram with bins
    case "Histogram":
      plotData = [{
        x: getColumn(x),
        type: "histogram",
        nbinsx: bins || 20,
        opacity: 0.55,

        marker: {
          color: "#271ad4",
          line: {
            color: "#0b1220",
            width: 1.3
          }
        }
      }];
      break;

    case "Box":
      plotData = [{
        y: getColumn(y || x),
        type: "box"
      }];
      break;

    case "Violin":
      plotData = [{
        y: getColumn(y || x),
        type: "violin",
        box: { visible: true },
        meanline: { visible: true }
      }];
      break;

    
    case "Density": {
      const values = getColumn(x).filter(v => v !== null && v !== undefined);
      const sorted = [...values].sort((a, b) => a - b);

      const min = Math.min(...sorted);
      const max = Math.max(...sorted);

      // smoother resolution
      const points = 100;
      const xVals = Array.from({ length: points }, (_, i) =>
        min + (i * (max - min)) / (points - 1)
      );

      const yVals = xVals.map((xi) =>
        kernelDensity(xi, sorted)
      );

      plotData = [

        // histogram base
        {
          x: values,
          type: "histogram",
          histnorm: "probability density",
          nbinsx: Math.ceil(Math.sqrt(values.length)),
          opacity: 0.55,

          marker: {
            color:  "#271ad4",
            line: {
              color: "#0b1220",
              width: 1.3
            }
          }
        },

        // KDE line
        {
          x: xVals,
          y: yVals,
          type: "scatter",
          mode: "lines",

          line: {
            color: "#9d3d05",
            width: 3,
            shape: "spline"
          }
        }
      ];
      break;
    }

    case "Scatter":
      plotData = [{
        x: getColumn(x),
        y: getColumn(y),
        mode: "markers",
        type: "scatter",
        marker: {
          color: color ? getColumn(color) : "#00ffaa"
        }
      }];
      break;

    case "Line":
      plotData = [{
        x: getColumn(x),
        y: getColumn(y),
        type: "scatter",
        mode: "lines"
      }];
      break;

    case "Bar":
    case "Count":
      const counts = getCounts(x);
      plotData = [{
        x: Object.keys(counts),
        y: Object.values(counts),
        type: "bar"
      }];
      break;

    case "Pie":
      const pieCounts = getCounts(x);
      plotData = [{
        labels: Object.keys(pieCounts),
        values: Object.values(pieCounts),
        type: "pie"
      }];
      break;

    case "Heatmap":
      const numCols = getNumericColumns();

      const matrix = numCols.map((c1) =>
        numCols.map((c2) => {
          const v1 = getColumn(c1);
          const v2 = getColumn(c2);

          const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

          const m1 = mean(v1);
          const m2 = mean(v2);

          let num = 0, d1 = 0, d2 = 0;

          for (let i = 0; i < v1.length; i++) {
            num += (v1[i] - m1) * (v2[i] - m2);
            d1 += (v1[i] - m1) ** 2;
            d2 += (v2[i] - m2) ** 2;
          }

          return num / Math.sqrt(d1 * d2);
        })
      );

      plotData = [{
        z: matrix,
        x: numCols,
        y: numCols,
        type: "heatmap"
      }];
      break;

    case "Scatter 3D":
      plotData = [{
        x: getColumn(x),
        y: getColumn(y),
        z: getColumn(z),
        mode: "markers",
        type: "scatter3d"
      }];
      break;

    case "Area":
      plotData = [{
        x: getColumn(x),
        y: getColumn(y),
        fill: "tozeroy",
        type: "scatter"
      }];
      break;

    case "Treemap":
      plotData = [{
        labels: getColumn(x),
        parents: getColumn(y || x).map(() => ""),
        type: "treemap"
      }];
      break;

    case "Sunburst":
      plotData = [{
        labels: getColumn(x),
        parents: getColumn(y || x).map(() => ""),
        type: "sunburst"
      }];
      break;

    case "Pair":
      const cols = getNumericColumns();

      plotData = [{
        type: "splom",
        dimensions: cols.map((c) => ({
          label: c,
          values: getColumn(c)
        }))
      }];
      break;

    case "Parallel":
      const pCols = getNumericColumns();

      plotData = [{
        type: "parcoords",
        dimensions: pCols.map((c) => ({
          label: c,
          values: getColumn(c)
        }))
      }];
      break;

    default:
      return <div>Unsupported chart</div>;
  }

  return (
    <div className="graph-wrapper">
      <PlotComponent
        className="graph"
        data={plotData}
        layout={layout}
        config={{ responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default Graph;