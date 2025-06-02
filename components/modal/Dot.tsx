import { View, Text, ColorValue } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { temperatureGradient } from "../averages/utils/constants";

interface DotProps {
  size?: number;
  colorsArr: string | [string, string, ...string[]];
}

const Dot = ({ size = 10, colorsArr }: DotProps) => {
  return (
    // <View
    //   style={{
    //     backgroundColor: color,
    //     width: size,
    //     height: size,
    //     borderRadius: "50%",
    //   }}
    // />
    <LinearGradient
      colors={
        Array.isArray(colorsArr)
          ? (colorsArr as [string, string, ...string[]])
          : [colorsArr, colorsArr]
      }
      start={{ x: 0, y: 0 }} // Start point (left)
      end={{
        x: 0,
        y: 1,
      }}
      style={{
        width: size,
        height: size,
        borderRadius: 20,
      }}
    />
  );
};

export default Dot;
