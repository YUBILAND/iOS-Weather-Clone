import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import { getTemperature } from "@/hooks/useDisplayUnits";

interface TodayAndAverageProps {
  currentHigh: number;
  averageHigh: number;
}
const TodayAndAverage = ({
  currentHigh,
  averageHigh,
}: TodayAndAverageProps) => {
  return (
    <View className="gap-1">
      <View className="flex-row justify-between items-center">
        <DefaultText style={{ color: colors.lightGray }}>Today</DefaultText>
        <DefaultText style={{ fontWeight: 800 }}>
          H:{Math.round(currentHigh)}°
        </DefaultText>
      </View>
      <View className="flex-row justify-between items-center">
        <DefaultText style={{ color: colors.lightGray }}>Average</DefaultText>
        <DefaultText style={{ fontWeight: 800 }}>H:{averageHigh}°</DefaultText>
      </View>
    </View>
  );
};

export default TodayAndAverage;
