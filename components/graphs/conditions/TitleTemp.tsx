import { View, Text, Image } from "react-native";
import React from "react";
import DefaultText from "../../atoms/DefaultText";
import { WeatherData, weatherKey } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";

interface TitleTemp {
  data: WeatherData;
  item: { id: number };
}

const TitleTemp = ({ data, item }: TitleTemp) => {
  const { location, forecast, current } = data;

  const hourlyTempMap = forecast?.forecastday[0].hour.map((hour) =>
    Math.round(parseFloat(hour.temp_c))
  );
  const maxCelsius = Math.max(...hourlyTempMap);
  const minCelsius = Math.min(...hourlyTempMap);

  const currentTemperature = Math.round(parseFloat(current?.temp_c));
  const maxTemperature = Math.round(
    parseFloat(forecast?.forecastday[item.id].day.maxtemp_c)
  );
  const minTemperature = Math.round(
    parseFloat(forecast?.forecastday[item.id].day.mintemp_c)
  );

  const currentWeatherImage =
    weatherKey[weatherPNG(current?.condition.text, current?.is_day)];

  const DailyWeatherImage =
    weatherKey[weatherPNG(forecast?.forecastday[item.id].day.condition.text)];

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
            {item.id === 0 ? currentTemperature : maxTemperature}
            &#176;
          </DefaultText>
          {item.id != 0 && (
            <DefaultText
              className="text-4xl"
              style={{ color: colors.lightGray }}
            >
              {minTemperature}&#176;
            </DefaultText>
          )}
          <Image
            source={item.id === 0 ? currentWeatherImage : DailyWeatherImage}
            style={{ width: 40, height: 40 }}
          />
        </View>

        {item.id === 0 ? (
          <DefaultText style={{ color: colors.lightGray }}>
            H: {maxCelsius}&#176; L: {minCelsius}&#176;
          </DefaultText>
        ) : (
          <DefaultText style={{ color: colors.lightGray }}>Celsius</DefaultText>
        )}
      </View>
    </View>
  );
};

export default TitleTemp;
