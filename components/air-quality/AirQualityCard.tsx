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

const AirQualityCard = ({ cityName }: { cityName: string }) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { location, forecast, current } = data[cityName];

  const AQI = getAQI(data[cityName]);
  const rating = getAQIRating(AQI);
  const message = getAQIMessage(AQI);

  return (
    <OpacityCard className="px-4 gap-y-2">
      <View className="flex-row items-center  gap-x-2 opacity-40">
        <CalendarDaysIcon size={22} color={"white"} />
        <DefaultText className="text-base uppercase font-semibold">
          Air Quality
        </DefaultText>
      </View>
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

      <DefaultText className="pt-2">{message}</DefaultText>
    </OpacityCard>
  );
};

export default AirQualityCard;
