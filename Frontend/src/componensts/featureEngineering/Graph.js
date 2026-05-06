export const PLOT_TYPES = {
  HISTOGRAM: "Histogram",
  BOX: "Box",
  SCATTER: "Scatter",
  LINE: "Line",
  BAR: "Bar",
  COUNT: "Count",
  PIE: "Pie",
  HEATMAP: "Heatmap",
  VIOLIN: "Violin",
  DENSITY: "Density",

  // advanced
  PAIR: "Pair",
  SCATTER_3D: "Scatter 3D",
  TREEMAP: "Treemap",
  SUNBURST: "Sunburst",
};

export const GRAPH_RULES = {
  single: {
    numerical: [
      "Histogram",
      "Box",
      "Violin",
      "Density"
    ],
    categorical: [
      "Bar",
      "Count",
      "Pie"
    ],
    binary: [
      "Count",
      "Bar"
    ]
  },

  double: {
    numerical_numerical: [
      "Scatter",
      "Line"
    ],
    categorical_numerical: [
      "Bar",
      "Box",
      "Violin"
    ],
    categorical_categorical: [
      "Heatmap",
      "Count"
    ]
  },

  multiple: {
    numerical: [
      "Pair",
      "Heatmap"
    ],
    mixed: [
      "Pair"
    ]
  }
};




export function normalizeType(dtype) {
  if (!dtype) return "categorical";

  dtype = dtype.toLowerCase();

  if (
    dtype.includes("int") ||
    dtype.includes("float") ||
    dtype.includes("double")
  ) {
    return "numerical";
  }

  if (dtype.includes("bool")) {
    return "binary";
  }

  return "categorical"; // object, string, etc.
}




export function getSuggestedPlots(columns) {
  // normalize types type inference
  const normalized = columns.map(c => ({
    ...c,
    type: normalizeType(c.type)
  }));

  if (normalized.length === 1) {
    return GRAPH_RULES.single[normalized[0].type] || [];
  }

  if (normalized.length === 2) {
    const [c1, c2] = normalized;

    if (c1.type === "numerical" && c2.type === "numerical") {
      return GRAPH_RULES.double.numerical_numerical;
    }

    if (
      (c1.type === "categorical" && c2.type === "numerical") ||
      (c2.type === "categorical" && c1.type === "numerical")
    ) {
      return GRAPH_RULES.double.categorical_numerical;
    }

    if (c1.type === "categorical" && c2.type === "categorical") {
      return GRAPH_RULES.double.categorical_categorical;
    }
  }

  if (normalized.length > 2) {
    const allNumerical = normalized.every(c => c.type === "numerical");

    if (allNumerical) {
      return GRAPH_RULES.multiple.numerical;
    }

    return GRAPH_RULES.multiple.mixed;
  }

  return [];
}


export function getDefaultPlot(columns) {
  const suggestions = getSuggestedPlots(columns);
  return suggestions.length > 0 ? suggestions[0] : null;
}


