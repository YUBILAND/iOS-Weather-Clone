import { View, Text, Image } from "react-native";
import React from "react";
import DefaultText from "../../atoms/DefaultText";
import { WeatherData, weatherKey } from "@/constants/constants";

import { colors } from "@/assets/colors/colors";
import { getDayArr } from "@/components/precipitation/utils/getDayArr";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";

interface TitleTemp {
  data: WeatherData;
  item: { id: number };
}

const TitleTemp = ({ data, item }: TitleTemp) => {
  const { forecast, current } = data;

  const hourlyTempMap = getDayArr(data, 0, "temp_c");
  const maxCelsius = Math.round(Math.max(...hourlyTempMap));
  const minCelsius = Math.round(Math.min(...hourlyTempMap));

  const currentTemperature = Math.round(parseFloat(current?.temp_c));
  const maxTemperature = Math.round(
    forecast?.forecastday[item.id].day.maxtemp_c
  );
  const minTemperature = Math.round(
    forecast?.forecastday[item.id].day.mintemp_c
  );

  const currentWeatherImage = weatherNameToImage(
    getWeatherName(current?.condition.code),
    current?.is_day
  );

  const DailyWeatherImage = weatherNameToImage(
    getWeatherName(forecast?.forecastday[item.id].day.condition.code),
    true
  );

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
          <DefaultText style={{ color: colors.lightGray, fontWeight: 500 }}>
            H:{maxCelsius}&#176; L:{minCelsius}&#176;
          </DefaultText>
        ) : (
          <DefaultText style={{ color: colors.lightGray }}>Celsius</DefaultText>
        )}
      </View>
    </View>
  );
};

export default TitleTemp;
