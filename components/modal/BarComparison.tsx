import { View, Text } from "react-native";
import React from "react";
import HorizontalBar from "../uv-index/HorizontalBar";
interface BarComparisonProps {
  todaysHigh: number;
  tomorrowsHigh: number;
  unit: any;
}

const BarComparison = ({
  todaysHigh,
  tomorrowsHigh,
  unit,
}: BarComparisonProps) => {
  const maxHigh = Math.max(todaysHigh, tomorrowsHigh);
  return (
    <View className="gap-y-2 px-4">
      <HorizontalBar
        title="Today"
        bgColor="light"
        currentHigh={Math.round(todaysHigh).toString() + unit}
        percentage={todaysHigh / maxHigh}
      />
      <HorizontalBar
        title="Tomorrow"
        bgColor="dark"
        currentHigh={Math.round(tomorrowsHigh).toString() + unit}
        percentage={tomorrowsHigh / maxHigh}
      />
    </View>
  );
};

export default BarComparison;
