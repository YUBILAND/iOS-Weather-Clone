import { View, Text } from "react-native";
import React from "react";
import HorizontalLine from "../atoms/HorizontalLine";
import { WeatherData } from "@/constants/constants";
import MoonPhaseInfoItem from "./MoonPhaseInfoItem";
import { stringToTime } from "@/hooks/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { getTimeUntilNextFullMoonDate } from "./utils/getNextFullMoonDate";

interface MoonPhaseInfoProps {
  data: WeatherData;
}

const MoonPhaseInfo = ({ data }: MoonPhaseInfoProps) => {
  const currentMoonIllumination =
    data.forecast.forecastday[0].astro.moon_illumination;
  const currentMoonrise = data.forecast.forecastday[0].astro.moonrise;

  const { americanTime } = useSelector((state: RootState) => state.settings);

  const daysUntilFullMoon = getTimeUntilNextFullMoonDate(data);

  const timeUntilFormatted =
    Math.floor(daysUntilFullMoon) >= 1
      ? Math.floor(daysUntilFullMoon).toString() + " DAYS"
      : Math.floor(daysUntilFullMoon * 24) + " HRS";

  return (
    <View className="">
      <MoonPhaseInfoItem
        text={"Illumination"}
        value={currentMoonIllumination + "%"}
      />
      <HorizontalLine />
      <MoonPhaseInfoItem
        text={"Moonrise"}
        value={stringToTime(americanTime, currentMoonrise)}
      />
      <HorizontalLine />
      <MoonPhaseInfoItem text={"Next Full Moon"} value={timeUntilFormatted} />
    </View>
  );
};

export default MoonPhaseInfo;
