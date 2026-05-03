export const numericalOps = [
  { value: "mean", label: "Mean", desc: "Calculates average value of the column" },
  { value: "median", label: "Median", desc: "Finds middle value after sorting" },
  { value: "mode", label: "Mode", desc: "Finds most frequent value" },
  { value: "min", label: "Min", desc: "Smallest value in column" },
  { value: "max", label: "Max", desc: "Largest value in column" },
  { value: "std", label: "Standard Deviation", desc: "Measures data spread" },
];

export const categoricalOps = [
  { value: "valueCount", label: "Value Counts", desc: "Counts occurrences of each category" },
  { value: "unique", label: "Unique Count", desc: "Counts distinct values" },
  { value: "mode", label: "Mode", desc: "Most frequent category" },
];

export const cleaningOps = [
  { value: "fill_mean", label: "Fill Missing (Mean)", desc: "Replace missing with mean" },
  { value: "fill_median", label: "Fill Missing (Median)", desc: "Replace missing with median" },
  { value: "fill_mode", label: "Fill Missing (Mode)", desc: "Replace missing with mode" },
  { value: "drop_missing", label: "Drop Missing Rows", desc: "Remove rows with missing values" },
  { value: "remove_duplicates", label: "Remove Duplicates", desc: "Delete duplicate rows" },
];

export const viewOps = [
  { value: "head", label: "First Rows", desc: "Shows top rows of dataset" },
  { value: "tail", label: "Last Rows", desc: "Shows bottom rows of dataset" },
  { value: "sample", label: "Random Sample", desc: "Random subset of data" },
];