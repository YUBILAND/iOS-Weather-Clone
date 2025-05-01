import { View, Text, ColorValue } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";

interface BarDotProps {
  barHeight: number;
  innerBallRadius: number;
  innerBallColor?: ColorValue;
  outerBallRadius: number;
  outerBallColor?: ColorValue;
  progress: number;
}

const BarDot = ({
  barHeight,
  innerBallRadius,
  innerBallColor = "white",
  outerBallRadius,
  outerBallColor = colors.mediumGray,
  progress,
}: BarDotProps) => {
  return (
    <View
      style={{
        marginLeft: progress,
        height: outerBallRadius,
        width: outerBallRadius,
        position: "absolute",
        top: 0,
        left: 0,
        marginTop: (barHeight - outerBallRadius) / 2,
        backgroundColor: outerBallColor,
      }}
      className="rounded-full"
    >
      <View
        style={{
          // marginLeft: (barWidth * index) / maxIndex,
          height: innerBallRadius,
          width: innerBallRadius,
          top: 0,
          left: 0,
          marginLeft: innerBallRadius / 2,
          marginTop: innerBallRadius / 2,
          backgroundColor: innerBallColor,
        }}
        className="absolute rounded-full "
      />
    </View>
  );
};

export default BarDot;
