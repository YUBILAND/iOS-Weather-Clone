import { SkImage } from "@shopify/react-native-skia";
import { ChartPressState } from "victory-native";

export type ChartPressStateY = {
  mainLine: number | undefined;
  secondLine: number | undefined;
  thirdLine: number | undefined;
  hour: number;
  currentLineTop: number | undefined;
  currentLineBottom: number | undefined;
  currentPosition: number | undefined;
};

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

export type ChartImageArrayType = [number[], (string | SkImage)[]];

export type ChartDomainType =
  | {
      x?: [number] | [number, number];
      y?: [number] | [number, number];
    }
  | undefined;
