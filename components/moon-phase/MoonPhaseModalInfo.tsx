import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import { getTimeUntilNextFullMoonDate } from "./utils/getNextFullMoonDate";
import { removeZeroFromTimeString, stringToTime } from "@/hooks/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

interface MoonPhaseModalInfoProps {
  data: WeatherData;
}

const MoonPhaseModalInfo = ({ data }: MoonPhaseModalInfoProps) => {
  const astroData = data.forecast.forecastday[0].astro;
  const daysUntilFullMoon = getTimeUntilNextFullMoonDate(data);

  const { americanTime } = useSelector((state: RootState) => state.settings);

  const moonrise =
    astroData.moonrise !== "No moonrise"
      ? stringToTime(americanTime, removeZeroFromTimeString(astroData.moonrise))
      : astroData.moonrise;
  const moonset =
    astroData.moonset !== "No moonset"
      ? stringToTime(americanTime, removeZeroFromTimeString(astroData.moonset))
      : astroData.moonset;

  const moonData = [
    {
      title: "Moon Illumination",
      value: astroData.moon_illumination + "%",
    },
    {
      title: "Moonrise",
      value: moonrise,
    },
    {
      title: "Moonset",
      value: moonset,
    },
    {
      title: "Next Full Moon",
      value: Math.floor(daysUntilFullMoon).toString() + " days",
    },
    {
      title: "Distance",
      value: "no idea",
    },
  ];

  return (
    <View className="mb-4" style={{ backgroundColor: "black" }}>
      {moonData.map((item, ind) => (
        <React.Fragment key={ind}>
          <View className="flex-row justify-between py-3 px-4">
            <DefaultText className="font-semibold " style={{ fontSize: 14 }}>
              {item.title}
            </DefaultText>

            <DefaultText style={{ color: colors.lightGray, fontSize: 14 }}>
              {item.value}
            </DefaultText>
          </View>
          {ind < moonData.length - 1 && <HorizontalLine />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default MoonPhaseModalInfo;
