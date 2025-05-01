import React from "react";
import { CurveType, Line, PointsArray } from "victory-native";
import {
  AnimatedProp,
  Color,
  DashPathEffect,
} from "@shopify/react-native-skia";

interface DashedLineProps {
  points: PointsArray;
  color: AnimatedProp<Color>;
  curveType: CurveType;
}

const DashedLine = ({ points, color, curveType }: DashedLineProps) => {
  return (
    <Line points={points} color={color} strokeWidth={6} curveType={curveType}>
      <DashPathEffect intervals={[10, 10]} />
    </Line>
  );
};

export default DashedLine;
