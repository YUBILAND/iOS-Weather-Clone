import { View, Text, Pressable, ImageBackground } from "react-native";
import React, { useRef } from "react";
import DefaultText from "../atoms/DefaultText";
import { getWeatherName, weatherNameToCardBg } from "@/utils/exampleForecast";
import { useWeatherData } from "@/hooks/useWeatherData";

interface LocationCardItemContainerProps {
  children: React.ReactNode;
  idx: number;
  weatherScreens: string[];
  goToWeatherScreen: (index: number) => void;
}

const LocationCardItemContainer = ({
  children,
  weatherScreens,
  idx,
  goToWeatherScreen,
}: LocationCardItemContainerProps) => {
  const data = useWeatherData();
  const background = weatherNameToCardBg(
    getWeatherName(data[weatherScreens[idx]]?.current.condition.code),
    data[weatherScreens[idx]]?.current.is_day
  );
  // const background = require("../../assets/weather-image/clear.png");
  return (
    <Pressable
      onPress={() => goToWeatherScreen(idx)}
      className="bg-red-400 h-28 rounded-2xl overflow-hidden"
    >
      <ImageBackground
        source={background}
        resizeMode="cover"
        className="px-4 pt-4 pb-2 h-full"
      >
        {children}
      </ImageBackground>
    </Pressable>
  );
};

export default LocationCardItemContainer;
