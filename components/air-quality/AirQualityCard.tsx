import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import ColoredBar from "../atoms/ColoredBar";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import OpacityCard from "../atoms/OpacityCard";
import getFont from "@/hooks/getFont";

const AirQualityCard = ({ cityName }: { cityName: string }) => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );
  const { location, forecast, current } = data[cityName];

  const AQI = Math.round(
    Math.max(current?.air_quality.o3, current?.air_quality.pm2_5)
  );

  const rating =
    AQI <= 50
      ? "Good"
      : AQI <= 100
      ? "Moderate"
      : AQI <= 150
      ? "Unhealthy for Sensitive Groups"
      : AQI <= 200
      ? "Unhealthy"
      : AQI <= 300
      ? "Very unhealthy"
      : "Hazardous";

  const message =
    AQI <= 50
      ? "Air quality is good. It's a great day to be outside!"
      : AQI <= 100
      ? "Air quality is moderate. Generally acceptable, but sensitive individuals should take care."
      : AQI <= 150
      ? "Air quality is unhealthy for sensitive groups. Limit prolonged outdoor exertion."
      : AQI <= 200
      ? "Air quality is unhealthy. Everyone may begin to feel health effects."
      : AQI <= 300
      ? "Air quality is very unhealthy. Health alert: everyone may experience serious health effects."
      : "Air quality is hazardous. Emergency conditions—everyone is at risk.";

  return (
    <OpacityCard className="px-4 gap-y-2">
      <View className="flex-row items-center  gap-x-2 opacity-40">
        <CalendarDaysIcon size={22} color={"white"} />
        <DefaultText className="text-base uppercase font-semibold">
          Air Quality
        </DefaultText>
      </View>
      <DefaultText className="text-4xl font-semibold">{AQI}</DefaultText>
      <DefaultText className="text-xl font-semibold">{rating}</DefaultText>

      <ColoredBar
        cityName={cityName}
        index={AQI}
        maxIndex={500}
        label={"AQI"}
        colorsArr={[
          "#00df72",
          "#f5e536",
          "#fc9003",
          "#f51458",
          "#ad02f6",
          "#82162c",
          "#82162c",
        ]}
        locationsArr={[0.05, 0.2, 0.3, 0.4, 0.5, 0.8, 1]}
      />

      <DefaultText className="pt-2">{message}</DefaultText>
    </OpacityCard>
  );
};

export default AirQualityCard;
