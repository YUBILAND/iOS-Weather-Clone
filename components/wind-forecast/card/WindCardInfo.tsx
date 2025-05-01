import { View, Text } from "react-native";
import React from "react";
import WindCardInfoItem from "./WindCardInfoItem";
import HorizontalLine from "../../atoms/HorizontalLine";
import { WeatherData } from "@/constants/constants";
import { convertWindUnits } from "../utils/convertWindUnits";
import { useOtherUnits } from "@/hooks/useOtherUnits";

interface WindCardInfoProps {
  data: WeatherData;
}

const WindCardInfo = ({ data }: WindCardInfoProps) => {
  const windUnits = useOtherUnits()["wind"];

  const windSpeed = Math.round(
    convertWindUnits(data.current.wind_mph, windUnits)
  );
  const maxWindSpeed = Math.round(
    Math.max(
      ...data.forecast.forecastday[0].hour.map((hour) => {
        return convertWindUnits(hour.gust_mph, windUnits);
      })
    )
  );
  return (
    <View className="">
      <WindCardInfoItem windSpeed={windSpeed} measurement={"Wind"} />
      <HorizontalLine />
      <WindCardInfoItem windSpeed={maxWindSpeed} measurement={"Gusts"} />
    </View>
  );
};

export default WindCardInfo;
