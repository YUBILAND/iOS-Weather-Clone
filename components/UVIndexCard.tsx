import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "./DefaultText";
import AirQualityBar from "./AirQualityBar";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import OpacityCard from "./OpacityCard";

const UVIndexCard = ({ cityName }: { cityName: string }) => {
  const { data } = useSelector((state: RootState) => state.weather);

  const { current } = data[cityName];

  const UV = Math.round(current?.uv);
  return (
    <OpacityCard className="px-4 gap-y-3">
      <View className="flex-row items-center  gap-x-2 opacity-40">
        <CalendarDaysIcon size={22} color={"white"} />
        <DefaultText className="text-base uppercase font-semibold">
          UV Index
        </DefaultText>
      </View>
      <DefaultText className="text-4xl font-semibold">{UV}</DefaultText>
      <DefaultText className="text-xl font-semibold">Good</DefaultText>

      <AirQualityBar cityName={cityName} index={UV} label={"UV"} />

      <DefaultText>Yeah its good trust me</DefaultText>
    </OpacityCard>
  );
};

export default UVIndexCard;
