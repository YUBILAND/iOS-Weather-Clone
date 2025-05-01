import { View, Text } from "react-native";
import React from "react";
import Dot from "../modal/Dot";
import DefaultText from "../atoms/DefaultText";

interface GraphLegendProps {
  leftText: string;
  rightText: string;
  firstColorsArr?: [string, string, ...string[]];
  secondColorsArr?: [string, string, ...string[]];
}
const GraphLegend = ({
  leftText,
  rightText,
  firstColorsArr = ["lightblue", "lightblue"],
  secondColorsArr = ["lightblue", "lightblue"],
}: GraphLegendProps) => {
  return (
    <View className="flex-row">
      <View className="flex-row gap-2">
        <Dot colorsArr={firstColorsArr} size={16} />
        <DefaultText>{leftText}</DefaultText>
      </View>

      <View className="flex-row gap-2 flex-1 justify-center">
        <Dot colorsArr={secondColorsArr} size={16} />
        <DefaultText>{rightText}</DefaultText>
      </View>
    </View>
  );
};

export default GraphLegend;
