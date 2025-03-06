import { View, Text, Image } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { WeatherData, weatherKey } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";
import { getDailyVisibilityArr } from "../visibility/utils/getDailyVisibilityArr";

interface HumidityLeftTextProps {
  data: WeatherData;
  item: { id: number };
}

const HumidityLeftText = ({ data, item }: HumidityLeftTextProps) => {
  const currentHumidity = data.current.humidity;

  const dailyHumidityArr = getDailyVisibilityArr(data, "humidity", 0);
  const dailyMax = Math.max(...dailyHumidityArr);
  const dailyMin = Math.min(...dailyHumidityArr);

  const hourlyTempMap = data.forecast?.forecastday[item.id].hour.map((hour) =>
    Math.round(parseFloat(hour.temp_c))
  );
  const maxCelsius = Math.max(...hourlyTempMap);
  const minCelsius = Math.min(...hourlyTempMap);

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
              ? Math.round(currentHumidity) + "mi"
              : Math.round(dailyMin) + " to"}
          </DefaultText>

          {item.id !== 0 && (
            <DefaultText className="text-4xl">
              {Math.round(dailyMax) + "mi"}
            </DefaultText>
          )}
        </View>
        {item.id === 0 ? (
          <DefaultText style={{ color: colors.lightGray }}>
            Pretty good
          </DefaultText>
        ) : (
          <DefaultText style={{ color: colors.lightGray }}>
            Pretty good
          </DefaultText>
        )}
      </View>
    </View>
  );
};

export default HumidityLeftText;
