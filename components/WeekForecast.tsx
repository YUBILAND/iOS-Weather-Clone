import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { WeatherType } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";
import { Forecast } from "@/app";

interface WeekForecastProps {
  forecast?: Forecast;
  getDate: (dateString: string) => string;
}

const WeekForecast: React.FC<WeekForecastProps> = ({ forecast, getDate }) => {
  return (
    <View className="mb-2 gap-y-3">
      <View className="flex-row items-center mx-5 gap-x-2">
        <CalendarDaysIcon size={22} color={"white"} />
        <Text className="text-white"> Daily Forecast</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 15 }}
        showsHorizontalScrollIndicator={false}
      >
        {forecast?.forecastday.map((item, index) => (
          <View
            key={item?.date}
            className="flex justify-center items-center w-24 rounded-3xl py-3 gap-y-1 mr-4"
            style={{ backgroundColor: colors.bgWhite(0.15) }}
          >
            <Image
              source={weatherPNG(
                (item?.day.condition.text.toLowerCase() as WeatherType) ??
                  "Sunny"
              )}
              className="h-11 w-11 "
            />
            <Text className="text-white">{getDate(item?.date)}</Text>
            <Text className="text-white text-xl font-semibold">
              {item?.day.avgtemp_c}&#176;
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default WeekForecast;
