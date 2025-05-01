import { View, Text } from "react-native";
import React from "react";
import { Bar, ChartBounds, PointsArray } from "victory-native";
import { colors } from "@/assets/colors/colors";

interface VerticalLineProps {
  points: PointsArray[];
  chartBounds: ChartBounds;
  size?: number;
}
const VerticalLine = ({ points, chartBounds, size = 2 }: VerticalLineProps) => {
  return (
    <>
      <Bar
        points={points[0]}
        chartBounds={chartBounds}
        barWidth={size}
        color={colors.bgWhite(0.5)}
        roundedCorners={{ topLeft: 10, topRight: 10 }}
      />

      <Bar
        points={points[1]}
        chartBounds={chartBounds}
        barWidth={size}
        color={colors.bgWhite(0.5)}
        roundedCorners={{ topLeft: 10, topRight: 10 }}
      />
    </>
  );
};

export default VerticalLine;
