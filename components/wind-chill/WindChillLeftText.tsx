import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";

interface WindChillLeftTextProps {
  data: WeatherData;
  id: number;
}

const WindChillLeftText = ({ data, id }: WindChillLeftTextProps) => {
  const currentWindChill = data.current.windchill_c;

  const dailyWindChillSpeed = data.forecast.forecastday[id].hour.map(
    (hour) => hour.windchill_c
  );
  const dailyMaxWindChill = Math.max(...dailyWindChillSpeed);
  const dailyMinWindChill = Math.min(...dailyWindChillSpeed);

  const hourlyTempMap = data.forecast?.forecastday[id].hour.map((hour) =>
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
          }}
        >
          <DefaultText className="text-4xl">
            {id === 0
              ? Math.round(currentWindChill) + "°"
              : Math.round(dailyMaxWindChill) + "°"}
          </DefaultText>

          {id !== 0 && (
            <DefaultText
              className="text-4xl"
              style={{ color: colors.lightGray }}
            >
              {Math.round(dailyMinWindChill) + "°"}
            </DefaultText>
          )}
        </View>
        {id === 0 ? (
          <DefaultText style={{ color: colors.lightGray }}>
            Actual: {Math.round(parseFloat(currentTemperature)) + "°"}
          </DefaultText>
        ) : (
          <View className="flex-row items-center gap-x-2">
            <DefaultText style={{ color: colors.lightGray }}>
              Actual H: {Math.round(maxCelsius) + "°"}
            </DefaultText>
            <DefaultText style={{ color: colors.lightGray }}>
              L: {Math.round(minCelsius) + "°"}
            </DefaultText>
          </View>
        )}
      </View>
    </View>
  );
};

export default WindChillLeftText;
