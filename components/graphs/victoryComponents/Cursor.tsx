import { View, Text } from "react-native";
import React from "react";
import { Circle, Rect } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

interface CursorProps {
  x: SharedValue<number>;
  y: SharedValue<number>;
  width: number;
  circleSize?: number;
}

const Cursor = ({ x, y, width, circleSize = 6 }: CursorProps) => {
  const rectX = useDerivedValue(() => x.value - width / 2); // offset to center line

  return (
    <>
      <Rect x={rectX} y={0} width={width} height={500} color="white" />
      <Circle cx={x} cy={y} r={circleSize + 2} color="black" />
      <Circle cx={x} cy={y} r={circleSize} color="white" />
    </>
  );
};

export default Cursor;
