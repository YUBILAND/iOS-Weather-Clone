import { WeatherData } from "@/constants/constants";
import { stringToTime } from "@/hooks/hooks";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import React from "react";
import { View } from "react-native";
import HorizontalLine from "../atoms/HorizontalLine";
import MoonPhaseInfoItem from "./MoonPhaseInfoItem";
import { getTimeUntilNextFullMoonDate } from "./utils/getNextFullMoonDate";

interface MoonPhaseInfoProps {
  data: WeatherData;
}

const MoonPhaseInfo = ({ data }: MoonPhaseInfoProps) => {
  const currentMoonIllumination =
    data.forecast.forecastday[0].astro.moon_illumination;
  const currentMoonrise = data.forecast.forecastday[0].astro.moonrise;

  const is12Hr = useIs12Hr();

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
        value={stringToTime(is12Hr, currentMoonrise)}
      />
      <HorizontalLine />
      <MoonPhaseInfoItem text={"Next Full Moon"} value={timeUntilFormatted} />
    </View>
  );
};

export default MoonPhaseInfo;
