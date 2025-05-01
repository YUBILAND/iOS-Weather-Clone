import { View, Text } from "react-native";
import React from "react";
import { Area, ChartBounds, CurveType, PointsArray } from "victory-native";

interface DarkenLeftProps {
  points: PointsArray;
  chartBounds: ChartBounds;
  curveType: CurveType;
  removeShade: boolean;
}
const DarkenLeft = ({
  chartBounds,
  points,
  curveType,
  removeShade,
}: DarkenLeftProps) => {
  const areaDarkTop = "rgba(0,0,0,0.2)";
  const areaDarkBottom = "rgba(0,0,0,0.3)";
  return (
    <>
      <Area
        points={points}
        y0={chartBounds.top}
        color={removeShade ? "rgba(0,0,0,0)" : areaDarkTop}
        animate={{ type: "timing", duration: 300 }}
        curveType={curveType}
      />

      <Area
        points={points}
        y0={chartBounds.bottom}
        color={removeShade ? "rgba(0,0,0,0)" : areaDarkBottom}
        animate={{ type: "timing", duration: 300 }}
        curveType={curveType}
      />
    </>
  );
};

export default DarkenLeft;
