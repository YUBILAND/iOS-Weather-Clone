import { View, Text } from "react-native";
import React from "react";
import { Area, ChartBounds, CurveType, PointsArray } from "victory-native";
import { colors, Colors } from "@/assets/colors/colors";
import { LinearGradient, vec } from "@shopify/react-native-skia";

interface GraphAreaProps {
  points: PointsArray;
  chartBounds: ChartBounds;
  customColor: Colors;
  curveType: CurveType;
  dark?: boolean;
}

const GraphArea = ({
  points,
  chartBounds,
  customColor,
  curveType,
  dark,
}: GraphAreaProps) => {
  const { bottom } = chartBounds;
  return (
    <Area
      points={points}
      y0={bottom}
      color={dark ? colors[customColor](0.6) : colors[customColor](1)}
      curveType={curveType}
    >
      <LinearGradient
        start={vec(bottom, 40)}
        end={vec(bottom, bottom)}
        colors={[
          colors[customColor](0.1),
          colors[customColor](0.3),
          colors[customColor](0.6),
        ]}
      />
    </Area>
  );
};

export default GraphArea;
