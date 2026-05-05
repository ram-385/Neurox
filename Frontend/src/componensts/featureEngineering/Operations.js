export const featureOps = [
  {
    value: "outlier_removal",
    label: "Outlier Removal",
    desc: "Removes extreme values using statistical methods like IQR or Z-score",
    options: [
      {
        value: "z_score",
        label: "Z-Score Method",
        params: [
          { name: "z_threshold", label: "Z Threshold", type: "number", default: 3 }
        ]
      },
      {
        value: "iqr",
        label: "IQR Method",
        params: [
          { name: "iqr_multiplier", label: "IQR Multiplier", type: "number", default: 1.5 }
        ]
      },
      {
        value: "percentile",
        label: "Percentile Method",
        params: [
          { name: "lower_percentile", label: "Lower %", type: "number" },
          { name: "upper_percentile", label: "Upper %", type: "number" }
        ]
      }
    ]
  },

  {
    value: "encoding",
    label: "Encoding",
    desc: "Converts categorical data into numeric format",
    options: [
      { value: "label", label: "Label Encoding", params: [] },
      { value: "one_hot", label: "One Hot Encoding", params: [] },
      {
        value: "ordinal",
        label: "Ordinal Encoding",
        params: [
          { name: "order", label: "Order (comma separated)", type: "text" }
        ]
      },
      { value: "frequency", label: "Frequency Encoding", params: [] }
    ]
  },

  {
    value: "feature_creation",
    label: "Feature Creation",
    desc: "Creates new features",
    options: [
      {
        value: "math",
        label: "Math Operations",
        params: [
          {
            name: "type",
            label: "Operation",
            type: "select",
            options: ["add", "subtract", "multiply", "divide"]
          }
        ]
      },
      {
        value: "binning",
        label: "Binning",
        params: [
          { name: "bins", label: "Bins (comma)", type: "text" },
          { name: "labels", label: "Labels (comma)", type: "text" }
        ]
      }
    ]
  },

  {
    value: "feature_transformation",
    label: "Feature Transformation",
    desc: "Transforms distribution",
    options: [
      { value: "log", label: "Log", params: [] },
      { value: "sqrt", label: "Sqrt", params: [] },
      {
        value: "power",
        label: "Power",
        params: [
          { name: "power", label: "Power", type: "number" }
        ]
      },
      {
        value: "clip",
        label: "Clip",
        params: [
          { name: "min", label: "Min", type: "number" },
          { name: "max", label: "Max", type: "number" }
        ]
      }
    ]
  },

  {
    value: "scaling",
    label: "Scaling",
    desc: "Brings features to same scale",
    options: [
      { value: "standard", label: "Standard", params: [] },
      { value: "minmax", label: "MinMax", params: [] },
      { value: "robust", label: "Robust", params: [] },
      { value: "maxabs", label: "MaxAbs", params: [] }
    ]
  }
];