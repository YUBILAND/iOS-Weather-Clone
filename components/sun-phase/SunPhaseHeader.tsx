import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import { removeZeroFromTimeString } from "@/hooks/hooks";
import HrAndMinSmaller from "../atoms/HrAndMinSmaller";

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
  // const totalDaylightHours = data.current?.is_day
  //   ? "Daylight remaining:"
  //   : "Nighttime remaining:" +
  //     remainingTime.split(":")[0] +
  //     "HR" +
  //     removeZeroFromTimeString(remainingTime.split(":")[1]) +
  //     "MIN";

  // console.log(remainingTime);
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
        {data.current?.is_day ? "Daylight remaining:" : "Nighttime remaining:"}{" "}
        <HrAndMinSmaller
          hour={remainingTime.split(":")[0]}
          minute={removeZeroFromTimeString(remainingTime.split(":")[1])}
        />
      </DefaultText>
    </>
  );
};

export default SunPhaseHeader;
