import React from "react";
import { PointsArray, Scatter } from "victory-native";

interface CurrentPositionCircleProps {
  points: PointsArray;
  strokeWidth: number;
}

const CurrentPositionCircle = ({
  points,
  strokeWidth,
}: CurrentPositionCircleProps) => {
  return (
    <>
      {/* Black circle border */}
      <Scatter
        points={points}
        shape="circle"
        radius={strokeWidth + 2}
        style="fill"
        color="black"
      />
      {/* White inner circle */}
      <Scatter
        points={points}
        shape="circle"
        radius={strokeWidth - 1}
        style="fill"
        color="white"
      />
    </>
  );
};

export default CurrentPositionCircle;
