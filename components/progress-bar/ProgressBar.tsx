import { colors } from "@/assets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";

type ProgressBarProps = {
  barWidth: number;
  currentTemperature?: number;
  weekHigh: number;
  weekLow: number;
  dailyHigh: number;
  dailyLow: number;
};

const ProgressBar = ({
  barWidth,
  currentTemperature,
  weekHigh,
  weekLow,
  dailyHigh,
  dailyLow,
}: ProgressBarProps) => {
  const grayRange = weekHigh! - weekLow!;

  const stepWidth = barWidth / grayRange;

  const startPadding = stepWidth * (dailyLow! - weekLow!);

  const coloredRange = dailyHigh! - dailyLow!;
  const progressWidth = coloredRange * stepWidth;

  const leftGrayPercentage = startPadding / progressWidth;
  const rightGrayPercentage =
    (progressWidth - (startPadding + progressWidth)) / progressWidth;

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
        colors={["#68CAD4", "#AED06A", "#DACE2C", "#FFC907", "#F8981D"]} // Define your gradient colors
        start={{ x: -leftGrayPercentage + 0.2, y: 0 }} // Start point (left)
        end={{
          x: barWidth / 100 + rightGrayPercentage - 0.2,
          y: 0,
        }} // End point (right)
        style={{
          width: progressWidth,
          height: 6,
          borderRadius: 20,
        }} // Set the size
      />
      {currentTemperature && (
        <DefaultText
          style={{
            marginLeft:
              startPadding +
              // The minus 1 is so the dot doesn't overflow right side
              // stepWidth * (currentTemperature! - dailyLow! -1),
              // Max so that it doesn't overflow left side
              Math.max(stepWidth * (currentTemperature - dailyLow - 1), 0),

            // 0,
          }}
          className="h-2 w-2 bg-white rounded-full absolute top-0 left-0 border-[1px] border-black"
        />
      )}
    </View>
  );
};

export default ProgressBar;
