import React from "react";
import { ColorValue, View } from "react-native";
import RoundedTemperature from "../atoms/RoundedTemperature";
import ProgressBar from "../progress-bar/ProgressBar";
import { colors } from "@/assets/colors/colors";

interface TemperatureBarProps {
  barWidth: number;
  currentTemperature?: number;
  weekHigh: number;
  weekLow: number;
  tempHigh: number;
  tempLow: number;
  hideLeft?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  barColor?: ColorValue;
}

const TemperatureBar = ({
  barWidth,
  currentTemperature,
  weekHigh,
  weekLow,
  tempHigh,
  tempLow,
  hideLeft = false,
  gradientColors = undefined,
  barColor = undefined,
}: TemperatureBarProps) => {
  return (
    <View
      className="flex-row justify-between items-center "
      style={{ gap: hideLeft ? 16 : 8 }}
    >
      {/* Daily Low */}
      {!hideLeft && (
        <View className="w-14">
          <RoundedTemperature
            className="text-xl font-semibold"
            temperature={tempLow}
            style={{ alignSelf: "flex-end" }}
          />
        </View>
      )}

      {/* Temperature Bar */}
      <ProgressBar
        barWidth={barWidth}
        weekHigh={weekHigh}
        weekLow={weekLow}
        dailyHigh={tempHigh}
        dailyLow={tempLow}
        currentTemperature={currentTemperature}
        gradientColors={gradientColors}
        barColor={barColor}
      />

      {/* Daily High */}
      <View style={{ width: hideLeft ? 50 : 40 }}>
        <RoundedTemperature
          className="text-xl font-semibold "
          temperature={tempHigh}
          style={{
            alignSelf: hideLeft ? "flex-end" : "flex-start",
            color: hideLeft ? "lightblue" : "white",
          }}
          unit={hideLeft ? '"' : undefined}
        />
      </View>
    </View>
  );
};

export default TemperatureBar;
