import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import { removeZeroFromTimeString, stringToTime } from "@/hooks/hooks";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import React, { memo } from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import { MoonPhase } from "./utils/constants";
import { getCustomMoonPercentage } from "./utils/getCustomMoonPercentage";
import { getMoonGraphLumin } from "./utils/getMoonGraphLumin";
import { getTimeUntilNextFullMoonDate } from "./utils/getNextFullMoonDate";
import { getCurrentMoonPhase } from "./utils/getCurrentMoonPhase";

interface MoonPhaseModalInfoProps {
  data: WeatherData;
  userScrolledIndex: number;
  initialScrollIndex: number;
}

const MoonPhaseModalInfo = memo(
  ({
    data,
    userScrolledIndex,
    initialScrollIndex,
  }: MoonPhaseModalInfoProps) => {
    const is12Hr = useIs12Hr();

    const currentMoonPhase = getCurrentMoonPhase(
      data,
      userScrolledIndex,
      initialScrollIndex
    );

    const getMoonData = () => {
      const astroData = data.forecast.forecastday[0].astro;

      const daysUntilFullMoon = getTimeUntilNextFullMoonDate(data);

      const moonrise =
        astroData.moonrise !== "No moonrise"
          ? stringToTime(is12Hr, removeZeroFromTimeString(astroData.moonrise))
          : astroData.moonrise;
      const moonset =
        astroData.moonset !== "No moonset"
          ? stringToTime(is12Hr, removeZeroFromTimeString(astroData.moonset))
          : astroData.moonset;

      const moonGraphLumin = getMoonGraphLumin(
        userScrolledIndex - initialScrollIndex
      );
      const daysUntilWithModulo =
        (daysUntilFullMoon - (userScrolledIndex - initialScrollIndex)) % 30;
      const daysLeft =
        daysUntilWithModulo > 0
          ? daysUntilWithModulo
          : 30 + daysUntilWithModulo;

      const customMoonPercentage = getCustomMoonPercentage(
        currentMoonPhase,
        moonGraphLumin
      );

      return { customMoonPercentage, daysLeft, moonrise, moonset };
    };

    const { customMoonPercentage, daysLeft, moonrise, moonset } = getMoonData();

    const moonData = [
      {
        title: "Moon Illumination",
        value: customMoonPercentage,
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
        value: Math.floor(daysLeft).toString() + " days",
      },
      {
        title: "Distance",
        value: "no idea",
      },
    ];

    const MoonInfo = () => {
      return moonData.map((item, ind) => (
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
      ));
    };

    return (
      <View className="mb-4" style={{ backgroundColor: "black" }}>
        <MoonInfo />
      </View>
    );
  }
);

export default MoonPhaseModalInfo;
