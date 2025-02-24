import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";
import DefaultText from "./DefaultText";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

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

  return (
    <View
      style={{
        width: barWidth,
        height: 6,
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
          height: 6,
          borderRadius: 20,
        }} // Set the size
      />

      <DefaultText
        style={{
          marginLeft: (barWidth * index) / maxIndex,
        }}
        className="h-2 w-2 bg-white rounded-full absolute top-0 left-0"
      />
    </View>
  );
};

export default ColoredBar;
