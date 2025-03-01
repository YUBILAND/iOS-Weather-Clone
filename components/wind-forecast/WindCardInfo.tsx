import { View, Text } from "react-native";
import React from "react";
import WindCardInfoItem from "./WindCardInfoItem";
import HorizontalLine from "../atoms/HorizontalLine";
import { WeatherData } from "@/constants/constants";

interface WindCardInfoProps {
  data: WeatherData;
}

const WindCardInfo = ({ data }: WindCardInfoProps) => {
  const windSpeed = Math.round(data.current.wind_mph);
  const maxWindSpeed = Math.round(
    Math.max(
      ...data.forecast.forecastday[0].hour.map((hour) => {
        return hour.wind_mph;
      })
    )
  );
  return (
    <View className="">
      <WindCardInfoItem windSpeed={windSpeed} measurement={"wind"} />
      <HorizontalLine />
      <WindCardInfoItem windSpeed={maxWindSpeed} measurement={"max wind"} />
    </View>
  );
};

export default WindCardInfo;
