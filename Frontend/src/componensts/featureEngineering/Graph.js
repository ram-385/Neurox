export const PLOT_TYPES = {
  HISTOGRAM: "histogram",
  BOX: "box",
  SCATTER: "scatter",
  LINE: "line",
  BAR: "bar",
  COUNT: "count",
  PIE: "pie",
  HEATMAP: "heatmap",
  VIOLIN: "violin",
  KDE: "kde",

  // advanced
  PAIR: "pair",
  SCATTER_3D: "scatter3d",
  TREEMAP: "treemap",
  SUNBURST: "sunburst",
};

export const GRAPH_RULES = {
  single: {
    numerical: [
      "histogram",
      "box",
      "violin",
      "kde"
    ],
    categorical: [
      "bar",
      "count",
      "pie"
    ],
    binary: [
      "count",
      "bar"
    ]
  },

  double: {
    numerical_numerical: [
      "scatter",
      "line"
    ],
    categorical_numerical: [
      "bar",
      "box",
      "violin"
    ],
    categorical_categorical: [
      "heatmap",
      "count"
    ]
  },

  multiple: {
    numerical: [
      "pair",
      "heatmap"
    ],
    mixed: [
      "pair"
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


