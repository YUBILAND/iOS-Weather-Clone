import { View, Text, Pressable } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import LocationCardItemContainer from "./LocationCardItemContainer";

interface LocationCardItemProps {
  currentCity: string;
  currentTemp: number;
  currentTime: string;
  currentWeatherCondition: string;
  currentHigh: number;
  currentLow: number;
}

const LocationCardItem = ({
  currentCity,
  currentTemp,
  currentTime,
  currentWeatherCondition,
  currentHigh,
  currentLow,
}: LocationCardItemProps) => {
  return (
    <>
      <View className="flex-row justify-between items-center flex-[50]">
        <View>
          <DefaultText className="font-semibold text-xl">
            {currentCity}
          </DefaultText>
          <DefaultText className=" text-base font-bold">
            {currentTime}
          </DefaultText>
        </View>

        <DefaultText className=" text-5xl">{currentTemp + "°"}</DefaultText>
      </View>

      <View className="justify-end flex-[50]">
        <View className="flex-row justify-between w-full items-center">
          <DefaultText className="text-base">
            {currentWeatherCondition}
          </DefaultText>
          <View className="flex-row gap-x-4">
            <DefaultText className="text-xl">
              H: {currentHigh + "°"}
            </DefaultText>
            <DefaultText className="text-xl">L: {currentLow + "°"}</DefaultText>
          </View>
        </View>
      </View>
    </>
  );
};

export default LocationCardItem;
