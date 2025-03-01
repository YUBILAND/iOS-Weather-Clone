import { View, Text, Image } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { WeatherData, weatherKey } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";

interface WindLeftTextProps {
  data: WeatherData;
  item: { id: number };
}

const WindLeftText = ({ data, item }: WindLeftTextProps) => {
  const currentWindDirection = data.current.wind_dir;

  const currentWindSpeed = Math.round(data.current.wind_mph);

  const dailyMaxWindSpeed = data.forecast.forecastday[item.id].day.maxwind_mph;

  const hourlyWindSpeedArr = data.forecast.forecastday[item.id].hour.map(
    (hour) => hour.wind_mph
  );

  const dailyMinWindSpeed = Math.min(...hourlyWindSpeedArr);

  const dailyWindSpeedRange =
    Math.round(dailyMinWindSpeed) +
    "~" +
    Math.round(dailyMaxWindSpeed) +
    " mph";

  return (
    <View className="flex-row justify-between items-center">
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <DefaultText className="text-4xl">
            {item.id === 0 ? currentWindDirection : dailyWindSpeedRange}
          </DefaultText>

          <DefaultText className="text-2xl font-semibold">
            {item.id === 0 && currentWindSpeed + "mph"}
          </DefaultText>
        </View>

        <DefaultText style={{ color: colors.lightGray }}>
          Fastest wind speed is{" "}
        </DefaultText>
      </View>
    </View>
  );
};

export default WindLeftText;
