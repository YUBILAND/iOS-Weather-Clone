import { ChartPressState } from "victory-native";

export type ChartPressStateType = ChartPressState<{
  x: number;
  y: {
    mainLine: number;
    currentLineTop: number;
    currentLineBottom: number;
    currentPosition: number;
    secondLine: number;
    thirdLine: number;
  };
}>;

export const GraphDefaultY = {
  mainLine: 0,
  currentLineTop: 0,
  currentLineBottom: 0,
  currentPosition: 0,
  secondLine: 0,
  thirdLine: 0,
};
