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
    icon: faRuler,
    desc: "lower is better"
  },
  {
    label: "MSE",
    value: "MSE",
    icon: faSquareRootVariable,
    desc: "lower is better"
  },
  {
    label: "RMSE",
    value: "RMSE",
    icon: faWaveSquare,
    desc: "lower is better"
  },
  {
    label: "R2Score",
    value: "R2Score",
    icon: faChartPie,
    desc: "higher is better"
  }
];

export const ClassificationMetrics = [
  {
    label: "Accuracy",
    value: "Accuracy",
    icon: faBullseye,
    desc: "higher is better"
  },
  {
    label: "Precision",
    value: "Precision",
    icon: faCrosshairs,
    desc: "higher is better"
  },
  {
    label: "Recall",
    value: "Recall",
    icon: faRotateLeft,
    desc: "higher is better"
  },
  {
    label: "F1-Score",
    value: "F1-Score",
    icon: faChartLine,
    desc: "higher is better"
  }
];