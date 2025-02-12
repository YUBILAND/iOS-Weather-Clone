import { View, Text, Image } from "react-native";
import React from "react";
import { weatherPNG } from "@/utils/exampleForecast";
import { WeatherType } from "@/constants/constants";

const WeatherImage = ({
  weatherName,
  className,
}: {
  weatherName?: string;
  className: string;
}) => {
  return (
    <Image
      source={weatherPNG((weatherName as WeatherType) ?? "Sunny")}
      className={className}
    />
  );
};

export default WeatherImage;
