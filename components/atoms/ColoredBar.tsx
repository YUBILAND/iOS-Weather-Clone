import { colors } from "@/assets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import BarDot from "./BarDot";

const ColoredBar = ({
  cityName,
  label,
  colorsArr,
  locationsArr,
  progress = null,
}: {
  cityName: string;
  progress?: number | null;

  label: "UV" | "AQI";
  colorsArr: readonly [string, string, ...string[]];
  locationsArr: readonly [number, number, ...number[]];
}) => {
  const barWidth = label === "AQI" ? 320 : 140;

  const startPadding = 0;

  const barHeight = 6;
  const ballRadius = 6;

  const blackRadiusExtra = 6;

  const blackBorderRadius = ballRadius + blackRadiusExtra;
  return (
    <View
      style={{
        width: barWidth,
        height: barHeight,
        borderRadius: 20,
        backgroundColor: colors.bgWhite(0.2),
        paddingLeft: startPadding,
        position: "relative",
      }}
    >
      <LinearGradient
        colors={colorsArr} // Define your gradient colors
        locations={locationsArr}
        start={{ x: 0, y: 0 }} // Start point (left)
        end={{
          x: 1,
          y: 0,
        }} // End point (right)
        style={{
          width: barWidth,
          height: barHeight,
          borderRadius: 20,
        }} // Set the size
      />
      {progress !== null && (
        <BarDot
          barHeight={barHeight}
          innerBallRadius={ballRadius}
          outerBallRadius={blackBorderRadius}
          // progress={(barWidth * index) / maxIndex}
          progress={barWidth * progress}
        />
      )}
    </View>
  );
};

export default ColoredBar;
