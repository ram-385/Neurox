export const numericalOps = [
  { value: "mean", label: "Mean", desc: "Calculates the average by summing all values and dividing by total count" },
  { value: "median", label: "Median", desc: "Finds the middle value when data is sorted, useful for skewed data" },
  { value: "mode", label: "Mode", desc: "Returns the value that appears most frequently in the column" },
  { value: "min", label: "Min", desc: "Identifies the smallest value present in the column" },
  { value: "max", label: "Max", desc: "Identifies the largest value present in the column" },
  { value: "std", label: "Standard Deviation", desc: "Measures how much the values deviate from the mean (data spread)" },
];

export const categoricalOps = [
  { value: "valueCount", label: "Value Counts", desc: "Counts how many times each category appears in the column" },
  { value: "unique", label: "Unique Count", desc: "Returns the number of distinct (non-repeated) values" },
  { value: "mode", label: "Mode", desc: "Finds the category that appears most frequently" },
];

export const cleaningOps = [
  { value: "fill_mean", label: "Fill Missing (Mean)", desc: "Replaces missing values with the column's average value" },
  { value: "fill_median", label: "Fill Missing (Median)", desc: "Replaces missing values with the middle value of the column" },
  { value: "fill_mode", label: "Fill Missing (Mode)", desc: "Replaces missing values with the most frequent value" },
  { value: "drop_missing", label: "Drop Missing Rows", desc: "Removes all rows that contain any missing values" },
  { value: "remove_duplicates", label: "Remove Duplicates", desc: "Deletes rows that are exactly repeated in the dataset" },
];

export const viewOps = [
  { value: "head", label: "First Rows", desc: "Displays the first few rows to quickly inspect the dataset" },
  { value: "tail", label: "Last Rows", desc: "Displays the last few rows of the dataset" },
  { value: "sample", label: "Random Sample", desc: "Shows a random subset of rows for quick exploration" },
];