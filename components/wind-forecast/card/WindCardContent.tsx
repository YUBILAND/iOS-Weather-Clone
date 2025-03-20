import { useWeatherData } from "@/hooks/useWeatherData";
import React from "react";
import { View } from "react-native";
import WindCardCompass from "./WindCardCompass";
import WindCardInfo from "./WindCardInfo";

interface WindCardContentProps {
  cityName: string;
}

const WindCardContent = ({ cityName }: WindCardContentProps) => {
  const data = useWeatherData();

  return (
    <>
      <View className="flex-row items-center">
        <View className="flex-[0.6]">
          <WindCardInfo data={data[cityName]} />
        </View>

        <View className="flex-[0.4]">
          <WindCardCompass data={data[cityName]} />
        </View>
      </View>
    </>
  );
};

export default WindCardContent;
