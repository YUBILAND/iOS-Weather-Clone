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
  closeSetting: () => void;
  drag?: () => void;
}

const LocationCardItemContainer = ({
  children,
  weatherScreens,
  idx,
  goToWeatherScreen,
  closeSetting,
  drag,
}: LocationCardItemContainerProps) => {
  const data = useWeatherData();
  const background = weatherNameToCardBg(
    getWeatherName(data[weatherScreens[idx]]?.current.condition.code),
    data[weatherScreens[idx]]?.current.is_day
  );
  // const background = require("../../assets/weather-image/clear.png");

  const handlePress = () => {
    goToWeatherScreen(idx);
    closeSetting();
  };
  return (
    <Pressable
      onLongPress={drag ?? null}
      onPress={handlePress}
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
