import React from "react";
import { View } from "react-native";
import { ChartBounds, PointsArray } from "victory-native";
import { Text, useFont } from "@shopify/react-native-skia";
import Roboto from "../../assets/fonts/Roboto-Regular.ttf";

interface RenderXAxisOutsideProps {
  chartBounds: ChartBounds;
  tickValuesX: number[];
}
const RenderXAxisOutside = ({
  chartBounds,
  tickValuesX,
}: RenderXAxisOutsideProps) => {
  const font = useFont(Roboto, 14);

  return tickValuesX.map((xVal: number, index) => {
    const graphSizeX = Math.abs(chartBounds.right - chartBounds.left);
    const graphSizeY = Math.abs(chartBounds.top - chartBounds.bottom);

    const text = index === 0 ? "Now" : xVal.toString() + "m";
    return (
      <Text
        key={index}
        x={graphSizeX * (index / 6)}
        y={graphSizeY + 20}
        font={font}
        text={text}
        color={"white"}
      />
    );
  });
};

export default RenderXAxisOutside;
