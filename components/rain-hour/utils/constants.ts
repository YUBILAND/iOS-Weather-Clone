import { ChartPressState } from "victory-native";

export const exampleRain = [
  0, 0.30000001192092896, 0.20000000298023224, 0, 0.30000001192092896,
];

export const exampleRainGraphData = [0, 15, 30, 45, 60].map((min, idx) => ({
  minute: min,
  mainBar: exampleRain[idx],
}));

export type BarChartPressStateType = ChartPressState<{
  x: number;
  y: {
    minute: number;
    mainBar: number;
  };
}>;

export const BarGraphDefaultY = {
  minute: 0,
  mainBar: 0,
};

export const exampleLocation = { lat: 47.6181, lon: -65.6511 };
