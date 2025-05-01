import { View, Text } from "react-native";
import React from "react";
import { SharedValue } from "react-native-reanimated";
import Cursor from "./Cursor";

export function ToolTip({
  x,
  y,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
}) {
  return (
    <>
      <Cursor x={x} y={y} width={1} circleSize={8} />
    </>
  );
}

export default ToolTip;
