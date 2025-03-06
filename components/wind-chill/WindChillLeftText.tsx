import { View, Text, Image } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { WeatherData, weatherKey } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";

interface WindChillLeftTextProps {
  data: WeatherData;
  item: { id: number };
}

const WindChillLeftText = ({ data, item }: WindChillLeftTextProps) => {
  const currentWindChill = data.current.windchill_c;

  const dailyWindChillSpeed = data.forecast.forecastday[item.id].hour.map(
    (hour) => hour.windchill_c
  );
  const dailyMaxWindChill = Math.max(...dailyWindChillSpeed);
  const dailyMinWindChill = Math.min(...dailyWindChillSpeed);

  const hourlyTempMap = data.forecast?.forecastday[item.id].hour.map((hour) =>
    Math.round(parseFloat(hour.temp_c))
  );
  const maxCelsius = Math.max(...hourlyTempMap);
  const minCelsius = Math.min(...hourlyTempMap);

  const currentTemperature = data.current.temp_c;

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
            {item.id === 0
              ? Math.round(currentWindChill) + "°"
              : Math.round(dailyMaxWindChill) + "°"}
          </DefaultText>

          {item.id !== 0 && (
            <DefaultText
              className="text-4xl"
              style={{ color: colors.lightGray }}
            >
              {Math.round(dailyMinWindChill) + "°"}
            </DefaultText>
          )}
        </View>
        {item.id === 0 ? (
          <DefaultText style={{ color: colors.lightGray }}>
            Current temperature is:{" "}
            {Math.round(parseFloat(currentTemperature)) + "°"}
          </DefaultText>
        ) : (
          <View className="flex-row items-center gap-x-2">
            <DefaultText style={{ color: colors.lightGray }}>
              Max temp is: {Math.round(maxCelsius) + "°"}
            </DefaultText>
            <DefaultText style={{ color: colors.lightGray }}>
              Min temp is: {Math.round(minCelsius) + "°"}
            </DefaultText>
          </View>
        )}
      </View>
    </View>
  );
};

export default WindChillLeftText;
