import React from "react";
import Plot from "react-plotly.js";
import "./Graph.css";

const PlotComponent = Plot?.default || Plot;

function Graph({ config, data }) {
  if (!config || !data || data.length === 0) return null;

  const { type, x, y, z = null,color = null,title = "",bins = 20,columns = []} = config || {};

  let plotData = [];

  let layout = {
  title: title || "",
  autosize: true,
 

  paper_bgcolor: "#0f172a",   
   plot_bgcolor: "#0b1224",
   plot_height: 200,    

  font: {
    color: "#e6f1ff"
  },
   
  xaxis: {
    gridcolor: "#1f2a4a",
    zerolinecolor: "#1f2a4a"
  },

  yaxis: {
    gridcolor: "#1f2a4a",
    zerolinecolor: "#1f2a4a"
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

  const getNumericColumns = () => {
    return columns?.filter(c => c.type === "numerical").map(c => c.name) || [];
  };

  
  switch (type) {

    case "histogram":
      plotData = [{
        x: getColumn(x),
        type: "histogram",
        nbinsx: bins || 20,
      }];
      break;

    case "box":
      plotData = [{
        y: getColumn(y || x),
        type: "box",
      }];
      break;

    case "violin":
      plotData = [{
        y: getColumn(y || x),
        type: "violin",
        box: { visible: true },
        meanline: { visible: true },
      }];
      break;



    case "kde":
      const values = getColumn(x).filter(v => v !== null && v !== undefined);


      const kde = (arr, bandwidth = 1) => {
        const min = Math.min(...arr);
        const max = Math.max(...arr);

        const points = 100;
        const step = (max - min) / points;

        const xVals = [];
        const yVals = [];

        for (let i = 0; i <= points; i++) {
          const x0 = min + i * step;
          xVals.push(x0);

          let sum = 0;
          for (let j = 0; j < arr.length; j++) {
            const u = (x0 - arr[j]) / bandwidth;
            sum += Math.exp(-0.5 * u * u);
          }

          yVals.push(sum / (arr.length * bandwidth * Math.sqrt(2 * Math.PI)));
        }

        return { x: xVals, y: yVals };
      };

      const kdeResult = kde(values, 1);

      plotData = [
       
        {
          x: values,
          type: "histogram",
          histnorm: "probability density",
          opacity: 0.4,
        },

       
        {
          x: kdeResult.x,
          y: kdeResult.y,
          type: "scatter",
          mode: "lines",
          line: {
            width: 3,
          },
        },
      ];
      break;



    case "scatter":
      plotData = [{
        x: getColumn(x),
        y: getColumn(y),
        mode: "markers",
        type: "scatter",
        marker: {
          color: color ? getColumn(color) : "#00ffaa",
        },
      }];
      break;


    case "line":
      plotData = [{
        x: getColumn(x),
        y: getColumn(y),
        type: "scatter",
        mode: "lines",
      }];
      break;

    case "bar":
    case "count":
      const counts = getCounts(x);
      plotData = [{
        x: Object.keys(counts),
        y: Object.values(counts),
        type: "bar",
      }];
      break;

    case "pie":
      const pieCounts = getCounts(x);
      plotData = [{
        labels: Object.keys(pieCounts),
        values: Object.values(pieCounts),
        type: "pie",
      }];
      break;

    case "heatmap":
      const numCols = getNumericColumns();

      const matrix = numCols.map((c1) =>
        numCols.map((c2) => {
          const v1 = getColumn(c1);
          const v2 = getColumn(c2);

          const mean = (arr) =>
            arr.reduce((a, b) => a + b, 0) / arr.length;

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
        type: "heatmap",
      }];
      break;

   
    case "scatter3d":
      plotData = [{
        x: getColumn(x),
        y: getColumn(y),
        z: getColumn(z),
        mode: "markers",
        type: "scatter3d",
      }];
      break;

    case "area":
      plotData = [{
        x: getColumn(x),
        y: getColumn(y),
        fill: "tozeroy",
        type: "scatter",
      }];
      break;

    case "treemap":
      plotData = [{
        labels: getColumn(x),
        parents: getColumn(y || x).map(() => ""),
        type: "treemap",
      }];
      break;

    case "sunburst":
      plotData = [{
        labels: getColumn(x),
        parents: getColumn(y || x).map(() => ""),
        type: "sunburst",
      }];
      break;

    case "pair":
      // simplified pair plot (scatter matrix)
      const cols = getNumericColumns();

      plotData = [{
        type: "splom",
        dimensions: cols.map((c) => ({
          label: c,
          values: getColumn(c),
        })),
      }];
      break;

    case "parallel":
      const pCols = getNumericColumns();

      plotData = [{
        type: "parcoords",
        dimensions: pCols.map((c) => ({
          label: c,
          values: getColumn(c),
        })),
      }];
      break;

    default:
      return <div>Unsupported chart</div>;
  }

 return (
      <PlotComponent
        className="graph"
        data={plotData}
        layout={layout}
        config={{ responsive: true }}
      />
);
}

export default Graph;