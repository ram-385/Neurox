import {
  faBullseye,
  faCrosshairs,
  faRotateLeft,
  faChartLine,
  faRuler,
  faSquareRootVariable,
  faWaveSquare,
  faChartPie
} from "@fortawesome/free-solid-svg-icons";

export const RegressionMetrics = [
  {
    label: "MAE",
    value: "MAE",
    icon: faRuler
  },
  {
    label: "MSE",
    value: "MSE",
    icon: faSquareRootVariable
  },
  {
    label: "RMSE",
    value: "RMSE",
    icon: faWaveSquare
  },
  {
    label: "R2Score",
    value: "R2Score",
    icon: faChartPie
  }
];

export const ClassificationMetrics = [
  {
    label: "Accuracy",
    value: "Accuracy",
    icon: faBullseye
  },
  {
    label: "Precision",
    value: "Precision",
    icon: faCrosshairs
  },
  {
    label: "Recall",
    value: "Recall",
    icon: faRotateLeft
  },
  {
    label: "F1-Score",
    value: "F1-Score",
    icon: faChartLine
  }
];