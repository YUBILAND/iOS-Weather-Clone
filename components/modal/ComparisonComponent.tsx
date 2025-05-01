import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import TemperatureBar from "../conditions/TemperatureBar";
import { TemperatureBarGroup } from "./utils/getDailyComparisonArr";

interface ComparisonComponentProps {
  rangeHigh: number;
  rangeLow: number;
  arr: TemperatureBarGroup[];
}
// Component for Displaying Daily Comparison In Modal Description
const ComparisonComponent = ({
  rangeHigh,
  rangeLow,
  arr,
}: ComparisonComponentProps) => {
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
              barWidth={160}
              weekHigh={rangeHigh}
              weekLow={rangeLow}
              tempHigh={Math.round(item.high)}
              tempLow={Math.round(item.low)}
              currentTemperature={
                item?.currentTemp ? item?.currentTemp : undefined
              }
            />
          </View>
        );
      })}
    </View>
  );
};

export default ComparisonComponent;
