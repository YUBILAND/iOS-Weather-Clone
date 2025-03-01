import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { WeatherData } from "@/constants/constants";
import { getWeekTempArr } from "../daily-forecast/utils/getWeekTempArr";

type ProgressBarProps = {
  currentTemperature: number;
  index: number;
  weekHigh: number;
  weekLow: number;
  dailyHigh: number;
  dailyLow: number;
};

const ProgressBar = ({
  currentTemperature,
  index,
  weekHigh,
  weekLow,
  dailyHigh,
  dailyLow,
}: ProgressBarProps) => {
  const progressWidth = 90;

  const range = weekHigh! - weekLow!;
  const stepWidth = progressWidth / range;

  const startPadding = stepWidth * (dailyLow! - weekLow!);

  const dailyRange = dailyHigh! - dailyLow!;
  const barWidth = dailyRange * stepWidth;

  const leftGrayPercentage = startPadding / progressWidth;
  const rightGrayPercentage =
    (progressWidth - (startPadding + barWidth)) / progressWidth;

  const stepWidthOffset = (progressWidth - range) / range;

  return (
    <View
      style={{
        width: progressWidth,
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
          x: 1 + rightGrayPercentage - 0.2,
          y: 0,
        }} // End point (right)
        style={{
          width: barWidth,
          height: 6,
          borderRadius: 20,
        }} // Set the size
      />
      {index === 0 && (
        <DefaultText
          style={{
            marginLeft:
              startPadding +
              stepWidthOffset * (currentTemperature! - dailyLow!),
          }}
          className="h-2 w-2 bg-white rounded-full absolute top-0 left-0"
        />
      )}
    </View>
  );
};

export default ProgressBar;
