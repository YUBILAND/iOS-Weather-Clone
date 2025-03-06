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
  const range = weekHigh! - weekLow!;
  const stepWidth = barWidth / range;

  const startPadding = stepWidth * (dailyLow! - weekLow!);

  const dailyRange = dailyHigh! - dailyLow!;
  const progressWidth = dailyRange * stepWidth;

  const leftGrayPercentage = startPadding / progressWidth;
  const rightGrayPercentage =
    (progressWidth - (startPadding + progressWidth)) / progressWidth;

  const stepWidthOffset = (progressWidth - range) / range;

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
          x: 1 + rightGrayPercentage - 0.2,
          y: 0,
        }} // End point (right)
        style={{
          width: progressWidth,
          height: 6,
          borderRadius: 20,
        }} // Set the size
      />
      {currentTemperature != undefined && (
        <DefaultText
          style={{
            marginLeft:
              startPadding +
              stepWidthOffset * (currentTemperature! - dailyLow!),
          }}
          className="h-2 w-2 bg-white rounded-full absolute top-0 left-0 border-[1px] border-black"
        />
      )}
    </View>
  );
};

export default ProgressBar;
