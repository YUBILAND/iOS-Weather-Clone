import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import TemperatureBar from "../conditions/TemperatureBar";
import { TemperatureBarGroup } from "./utils/getDailyComparisonArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import { useMonthlyPrecipArr } from "../averages/utils/constants";
import { colors } from "@/assets/colors/colors";

interface PrecipMonthlyAveragesProps {
  arr: { text: string; precip: number }[];
}
// Component for Displaying Daily Comparison In Modal Description
const PrecipMonthlyAverages = ({ arr }: PrecipMonthlyAveragesProps) => {
  const precipArr = arr.map((item) => item.precip);
  const { arrMax: precipYearlyHigh } = getMinMaxArr(precipArr);
  return (
    <View className="gap-y-2 px-4">
      {arr.map((item, index) => {
        return (
          <View key={index} className="flex-row justify-between items-center">
            <DefaultText
              style={{ fontSize: 16, fontWeight: 700 }}
              className=" font-semibold"
            >
              {item.text}
            </DefaultText>

            <TemperatureBar
              barWidth={220}
              weekHigh={precipYearlyHigh}
              weekLow={0}
              tempHigh={item.precip}
              tempLow={0}
              hideLeft
              gradientColors={["lightblue", "lightblue"]}
              barColor={colors.bgBlack(0.3)}
            />
          </View>
        );
      })}
    </View>
  );
};

export default PrecipMonthlyAverages;
