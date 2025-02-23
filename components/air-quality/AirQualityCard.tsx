import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import AirQualityBar from "./AirQualityBar";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import OpacityCard from "../atoms/OpacityCard";

const AirQualityCard = ({ cityName }: { cityName: string }) => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const { location, forecast, current } = data[cityName];

  const AQI = Math.round(
    Math.max(current?.air_quality.o3, current?.air_quality.pm2_5)
  );
  return (
    <OpacityCard className="px-4 gap-y-2">
      <View className="flex-row items-center  gap-x-2 opacity-40">
        <CalendarDaysIcon size={22} color={"white"} />
        <DefaultText className="text-base uppercase font-semibold">
          Air Quality
        </DefaultText>
      </View>
      <DefaultText className="text-4xl font-semibold">{AQI}</DefaultText>
      <DefaultText className="text-xl font-semibold">Good</DefaultText>

      <AirQualityBar cityName={cityName} index={AQI} label={"AQI"} />

      <DefaultText>Yeah its good trust me</DefaultText>
    </OpacityCard>
  );
};

export default AirQualityCard;
