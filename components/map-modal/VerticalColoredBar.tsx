import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import BarDot from "../atoms/BarDot";

interface VerticalColoredBarProps {
  cityName: string;
  progress?: number | null;

  colorsArr: readonly [string, string, ...string[]];
  locationsArr: readonly [number, number, ...number[]];
  //   height: number;
}

const VerticalColoredBar = ({
  cityName,
  colorsArr,
  locationsArr,
  progress = null,
}: //   height,
VerticalColoredBarProps) => {
  //   const barWidth = label === "AQI" ? 320 : 140;

  const startPadding = 0;

  const barWidth = 6;
  //   const barHeight = height;
  const ballRadius = 6;

  const blackRadiusExtra = 6;

  const blackBorderRadius = ballRadius + blackRadiusExtra;
  return (
    <View
      style={{
        width: barWidth,
        height: "100%",
        borderRadius: 20,
        backgroundColor: colors.bgWhite(0.2),
        paddingLeft: startPadding,
        position: "relative",
      }}
    >
      <LinearGradient
        colors={colorsArr} // Define your gradient colors
        locations={locationsArr}
        start={{ x: 0, y: 1 }} // Start point (left)
        end={{
          x: 0,
          y: 0,
        }} // End point (right)
        style={{
          width: barWidth,
          height: "100%",
          borderRadius: 20,
        }} // Set the size
      />
      {/* {progress !== null && (
        <BarDot
          barHeight={barHeight}
          innerBallRadius={ballRadius}
          outerBallRadius={blackBorderRadius}
          // progress={(barWidth * index) / maxIndex}
          progress={barWidth * progress}
        />
      )} */}
    </View>
  );
};

export default VerticalColoredBar;
