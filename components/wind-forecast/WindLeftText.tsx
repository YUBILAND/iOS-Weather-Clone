import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";

interface WindLeftTextProps {
  data: WeatherData;
  item: { id: number };
}

const WindLeftText = ({ data, item }: WindLeftTextProps) => {
  const currentWindDirection = data.current.wind_dir;

  const currentWindSpeed = Math.round(data.current.wind_mph);
  console.log(currentWindSpeed);

  const dailyMaxWindSpeed = data.forecast.forecastday[item.id].day.maxwind_mph;

  const hourlyWindSpeedArr = data.forecast.forecastday[item.id].hour.map(
    (hour) => hour.wind_mph
  );

  const dailyMinWindSpeed = Math.min(...hourlyWindSpeedArr);

  const dailyWindSpeedRange =
    Math.round(dailyMinWindSpeed) +
    "–" +
    Math.round(dailyMaxWindSpeed) +
    " mph";

  const currentGustSpeed = data.current.gust_mph;

  const gustArr = data.forecast.forecastday[item.id].hour.map(
    (hour) => hour.gust_mph
  );
  const dailyMaxGustSpeed = Math.max(...gustArr);

  return (
    <View className="">
      <View
        style={{
          flexDirection: "row",
          // alignItems: "flex-end",
          gap: 8,
        }}
      >
        <DefaultText className="text-4xl font-semibold">
          {item.id === 0 ? currentWindSpeed + "mph" : dailyWindSpeedRange}
        </DefaultText>
        {item.id === 0 ? (
          <DefaultText
            className="text-4xl"
            style={{ color: colors.bgWhite(0.4) }}
          >
            {currentWindDirection}
          </DefaultText>
        ) : null}
      </View>

      <DefaultText style={{ color: colors.lightGray }}>
        {item.id === 0
          ? `Gusts: ${Math.round(currentGustSpeed)} mph`
          : `Gusts up to ${Math.round(dailyMaxGustSpeed)} mph`}
      </DefaultText>
    </View>
  );
};

export default WindLeftText;
