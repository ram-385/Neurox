import React from "react";
import Plot from "react-plotly.js";
import './Chart.css'

const PlotComponent = Plot?.default || Plot;

function kernelDensity(x, data) {

  const n = data.length;

  const mean =
    data.reduce((a, b) => a + b, 0) / n;

  const variance =
    data.reduce(
      (acc, val) => acc + Math.pow(val - mean, 2),
      0
    ) / n;

  const bandwidth = 1.06 * Math.sqrt(variance) * Math.pow(n, -1 / 5);
  const sum = data.reduce((acc, xi) => {

    const u = (x - xi) / bandwidth;

    return acc + Math.exp(-0.5 * u * u);

  }, 0);

  return (
    sum /
    (n * bandwidth * Math.sqrt(2 * Math.PI))
  );
}



function Chart({ config, data }) {

  const dummyData = [
    { Age: 18 },
    { Age: 21 },
    { Age: 22 },
    { Age: 24 },
    { Age: 25 },
    { Age: 27 },
    { Age: 28 },
    { Age: 29 },
    { Age: 30 },
    { Age: 31 },
    { Age: 32 },
    { Age: 34 },
    { Age: 35 },
    { Age: 36 },
    { Age: 38 },
    { Age: 40 },
    { Age: 41 },
    { Age: 42 },
    { Age: 45 },
    { Age: 48 }
  ];


  const dummyConfig = {
    column: "Age",
    operation: "kde",
    type: "float"
  };


  const activeConfig =
    config &&
    config.column &&
    config.operation
      ? config
      : dummyConfig;

  const activeData =
    Array.isArray(data) && data.length > 0
      ? data
      : dummyData;



  const { column, operation, type } = activeConfig;

  const values = activeData
    .map((row) => row[column])
    .filter(
      (v) =>
        v !== undefined &&
        v !== null
    );



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



  const layout = (titleText) => ({
    title: {
      text: titleText,
      x: 0.5,
      font: {
        size: 18,
        color: "#ffffff"
      },
    },

    paper_bgcolor: "#0a0f2c",
    plot_bgcolor: "#0a0f2c",

    font: {
      color: "#e6f1ff"
    },

    xaxis: {
      showgrid: false,
      zeroline: false
    },

    yaxis: {
      showgrid: false,
      zeroline: false
    },

    height: 350,

    margin: {
      t: 40,
      l: 40,
      r: 20,
      b: 40
    },
  });



  const renderNumerical = () => {

    switch (operation) {

      case "histogram":

        return (
          <PlotComponent
            data={[
              {
                x: values,
                type: "histogram",

                nbinsx: Math.ceil(
                  Math.sqrt(values.length)
                ),

                opacity: 0.8,

                marker: {
                  color: "#00ffaa",

                  line: {
                    width: 1
                  }
                }
              },
            ]}

            layout={layout(
              `Histogram of ${column}`
            )}

            style={{
              width: "100%",
              height: "100%"
            }}

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

                pointpos: 0,

                marker: {
                  color: "#00ffaa"
                }
              },
            ]}

            layout={layout(
              `Box Plot of ${column}`
            )}

            style={{
              width: "100%",
              height: "100%"
            }}

            useResizeHandler={true}
          />
        );



      case "kde": {

        const sorted =
          [...values].sort((a, b) => a - b);

        const min = Math.min(...sorted);

        const max = Math.max(...sorted);

        const x = Array.from(
          { length: 100 },
          (_, i) =>
            min +
            (i * (max - min)) / 99
        );

        const y = x.map((xi) =>
          kernelDensity(xi, sorted)
        );

        return (
          <PlotComponent
            data={[

              {
                x: values,

                type: "histogram",

                histnorm: "probability density",

                nbinsx: Math.ceil(
                  Math.sqrt(values.length)
                ),

                opacity: 0.6,

                marker: {
                  color: "#00ffaa",

                  line: {
                    width: 1
                  },
                },
              },

              {
                x,
                y,

                type: "scatter",

                mode: "lines",

                line: {
                  width: 3,
                  color: "#ff4d4f"
                },
              },
            ]}

            layout={{
              ...layout(
                `Histogram + KDE of ${column}`
              ),
            }}

            style={{
              width: "100%",
              height: "100%"
            }}

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

                line: {
                  color: "#00ffaa"
                }
              },
            ]}

            layout={layout(
              `Line Plot of ${column}`
            )}

            style={{
              width: "100%",
              height: "100%"
            }}

            useResizeHandler={true}
          />
        );



      default:
        return (
          <div style={{ color: "#aaa" }}>
            Invalid numerical operation
          </div>
        );
    }
  };



  const renderCategorical = () => {

    const { labels, freq } = getCounts();

    switch (operation) {

      case "bar":
      case "count":

        return (
          <PlotComponent
            data={[
              {
                x: labels,
                y: freq,
                type: "bar",

                marker: {
                  color: "#00ffaa"
                }
              }
            ]}

            layout={layout(
              `${operation === "bar"
                ? "Bar Chart"
                : "Count Plot"} of ${column}`
            )}

            style={{
              width: "100%",
              height: "100%"
            }}

            useResizeHandler={true}
          />
        );



      case "pie":

        return (
          <PlotComponent
            data={[
              {
                labels,
                values: freq,
                type: "pie"
              }
            ]}

            layout={layout(
              `Pie Chart of ${column}`
            )}

            style={{
              width: "100%",
              height: "100%"
            }}

            useResizeHandler={true}
          />
        );



      case "donut":

        return (
          <PlotComponent
            data={[
              {
                labels,
                values: freq,
                type: "pie",
                hole: 0.4
              }
            ]}

            layout={layout(
              `Donut Chart of ${column}`
            )}

            style={{
              width: "100%",
              height: "100%"
            }}

            useResizeHandler={true}
          />
        );



      default:
        return (
          <div style={{ color: "#aaa" }}>
            Invalid categorical operation
          </div>
        );
    }
  };



  const isNumerical = (type, values) => {
  if (!type) return false;

  const t = type.toLowerCase();

  const isNumericType =
    t.includes("int") ||
    t.includes("float") ||
    t.includes("double");

  if (!isNumericType) return false;

  const uniqueValues = new Set(
    values.filter(
      (v) =>
        v !== null &&
        v !== undefined &&
        v !== ""
    )
  );

  return uniqueValues.size > 10;
};



  return (
    <div
      className="chart-container"
      style={{
        marginTop: "20px"
      }}
    >
      {
        isNumerical(type, values)
          ? renderNumerical()
          : renderCategorical()
      }
    </div>
  );
}

export default Chart;