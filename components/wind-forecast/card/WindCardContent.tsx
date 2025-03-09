import { View, Text } from "react-native";
import React from "react";
import WindCardInfo from "./WindCardInfo";
import WindCardCompass from "./WindCardCompass";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

interface WindCardContentProps {
  cityName: string;
}

const WindCardContent = ({ cityName }: WindCardContentProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

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
