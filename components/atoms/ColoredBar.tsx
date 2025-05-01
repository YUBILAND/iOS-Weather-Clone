import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";
import DefaultText from "./DefaultText";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import BarDot from "./BarDot";

const ColoredBar = ({
  cityName,
  index,
  maxIndex,
  label,
  colorsArr,
  locationsArr,
}: {
  cityName: string;
  index: number;
  maxIndex: number;

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

      {/* <View
        style={{
          marginLeft: (barWidth * index) / maxIndex,
          height: blackBorderRadius,
          width: blackBorderRadius,
          position: "absolute",
          top: 0,
          left: 0,
          marginTop: (barHeight - blackBorderRadius) / 2,
          backgroundColor: colors.mediumGray,
        }}
        className="rounded-full"
      >
        <View
          style={{
            // marginLeft: (barWidth * index) / maxIndex,
            height: ballRadius,
            width: ballRadius,
            top: 0,
            left: 0,
            marginLeft: blackRadiusExtra / 2,
            marginTop: blackRadiusExtra / 2,
          }}
          className="absolute bg-white rounded-full "
        />
      </View> */}

      <BarDot
        barHeight={barHeight}
        innerBallRadius={ballRadius}
        outerBallRadius={blackBorderRadius}
        progress={(barWidth * index) / maxIndex}
      />
    </View>
  );
};

export default ColoredBar;
