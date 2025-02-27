import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";

interface SunPhaseHeader {
  data: WeatherData;
  isActive: boolean;
  nextPhaseTime: string;
  remainingTime: string;
}

const SunPhaseHeader = ({
  data,
  isActive,
  nextPhaseTime,
  remainingTime,
}: SunPhaseHeader) => {
  return (
    <>
      <DefaultText
        className="text-3xl uppercase font-semibold"
        style={{ opacity: isActive ? 0 : 100 }}
      >
        {nextPhaseTime}
      </DefaultText>
      <DefaultText
        className="text-base font-semibold"
        style={{ opacity: isActive ? 0 : 100, color: colors.lightGray }}
      >
        {`${data.current?.is_day ? "Sunset" : "Sunrise"} in ${
          remainingTime.split(":")[0]
        } hrs ${remainingTime.split(":")[1]} mins`}
      </DefaultText>
    </>
  );
};

export default SunPhaseHeader;
