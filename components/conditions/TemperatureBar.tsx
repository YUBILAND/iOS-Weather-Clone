import { View, Text } from "react-native";
import React from "react";
import RoundedTemperature from "../atoms/RoundedTemperature";
import ProgressBar from "../progress-bar/ProgressBar";
import { WeatherData } from "@/constants/constants";

interface TemperatureBarProps {
  barWidth: number;
  currentTemperature?: number;
  weekHigh: number;
  weekLow: number;
  tempHigh: number;
  tempLow: number;
}

const TemperatureBar = ({
  barWidth,
  currentTemperature,
  weekHigh,
  weekLow,
  tempHigh,
  tempLow,
}: TemperatureBarProps) => {
  return (
    <View className="flex-row justify-between items-center gap-x-4">
      {/* Daily Low */}
      <View className="w-8">
        <RoundedTemperature
          className="text-xl font-semibold"
          temperature={Math.round(tempLow)}
          style={{ alignSelf: "flex-end" }}
        />
      </View>

      {/* Temperature Bar */}
      <View>
        <ProgressBar
          barWidth={barWidth}
          weekHigh={weekHigh}
          weekLow={weekLow}
          dailyHigh={tempHigh}
          dailyLow={tempLow}
          currentTemperature={currentTemperature}
        />
      </View>

      {/* Daily High */}
      <View className="w-8">
        <RoundedTemperature
          className="text-xl font-semibold "
          temperature={Math.round(tempHigh)}
          style={{ alignSelf: "flex-end" }}
        />
      </View>
    </View>
  );
};

export default TemperatureBar;
