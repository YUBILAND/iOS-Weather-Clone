import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import ColoredBar from "../atoms/ColoredBar";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import OpacityCard from "../atoms/OpacityCard";
import getFont from "@/hooks/getFont";
import { getAQI } from "./utils/getAQI";
import { getAQIRating } from "./utils/getAQIRating";
import { getAQIMessage } from "./utils/getAQIMessage";
import CardTitle from "../atoms/CardTitle";
import CardBottomText from "../atoms/CardBottomText";

interface AirQualityCardProps {
  cityName: string;
  iconSize: number;
}

const AirQualityCard = ({ cityName, iconSize }: AirQualityCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

  const AQI = getAQI(data[cityName]);
  const rating = getAQIRating(AQI);
  const message = getAQIMessage(AQI);

  function lerp(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x: number
  ): number {
    return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
  }

  function pm25_aqi(pm25: number) {
    const c = Math.floor(10 * pm25) / 10;
    const a =
      c < 0
        ? 0 // values below 0 are considered beyond AQI
        : c < 12.1
        ? lerp(0, 50, 0.0, 12.0, c)
        : c < 35.5
        ? lerp(51, 100, 12.1, 35.4, c)
        : c < 55.5
        ? lerp(101, 150, 35.5, 55.4, c)
        : c < 150.5
        ? lerp(151, 200, 55.5, 150.4, c)
        : c < 250.5
        ? lerp(201, 300, 150.5, 250.4, c)
        : c < 350.5
        ? lerp(301, 400, 250.5, 350.4, c)
        : c < 500.5
        ? lerp(401, 500, 350.5, 500.4, c)
        : 500; // values above 500 are considered beyond AQI
    return Math.round(a);
  }

  const realAQI = pm25_aqi(data[cityName].current?.air_quality.pm2_5);
  // console.log(realAQI);

  return (
    <OpacityCard className="px-4 gap-y-2">
      <CardTitle
        title={"Air Quality"}
        icon={<CalendarDaysIcon size={iconSize} color={"white"} />}
      />

      <DefaultText className="text-4xl font-semibold">{AQI}</DefaultText>
      <DefaultText className="text-xl font-semibold">{rating}</DefaultText>

      <ColoredBar
        cityName={cityName}
        index={AQI}
        maxIndex={500}
        label={"AQI"}
        colorsArr={[
          "#00df72",
          "#f5e536",
          "#fc9003",
          "#f51458",
          "#ad02f6",
          "#82162c",
          "#82162c",
        ]}
        locationsArr={[0.05, 0.2, 0.3, 0.4, 0.5, 0.8, 1]}
      />

      <CardBottomText className="pt-2" text={message} />
    </OpacityCard>
  );
};

export default React.memo(AirQualityCard);
