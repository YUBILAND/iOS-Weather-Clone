import { View, Text, Image } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { WeatherData, weatherKey } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";

interface VisibilityLeftTextProps {
  data: WeatherData;
  item: { id: number };
}

const VisibilityLeftText = ({ data, item }: VisibilityLeftTextProps) => {
  const currentVisibility = data.current.vis_miles;

  const dailyVisibility = data.forecast.forecastday[item.id].hour.map(
    (hour) => hour.vis_miles
  );
  const dailyMaxVisibility = Math.max(...dailyVisibility);
  const dailyMinVisibility = Math.min(...dailyVisibility);

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
              ? Math.round(currentVisibility) + "mi"
              : Math.round(dailyMinVisibility) + " to"}
          </DefaultText>

          {item.id !== 0 && (
            <DefaultText className="text-4xl">
              {Math.round(dailyMaxVisibility) + "mi"}
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

export default VisibilityLeftText;
