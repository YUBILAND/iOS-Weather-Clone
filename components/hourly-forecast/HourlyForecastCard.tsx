import { colors } from "@/assets/colors/colors";
import { useAmericanTime } from "@/hooks/useAmericanTime";
import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import HourlyForecastItem from "./HourlyForecastItem";
import { getHourlyForecastObject } from "./utils/getHourlyForecast";

interface HourlyForecastProps {
  cityName: string;
  showModal: () => void;
}

const HourlyForecast = ({ cityName, showModal }: HourlyForecastProps) => {
  const americanTime = useAmericanTime();
  const data = useWeatherData();

  const dailyArr = useMemo(
    () => getHourlyForecastObject(data[cityName], americanTime),
    [data, cityName, americanTime]
  );

  const weatherMessage = "Random text related to today's weather";

  return (
    <OpacityCard>
      <Pressable
        className="gap-y-3 "
        onPress={() => {
          showModal();
        }}
      >
        <View className="flex-row ml-2 px-4">
          <DefaultText>{weatherMessage}</DefaultText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            borderTopWidth: 1,
            borderTopColor: colors.bgWhite(0.2),
            paddingRight: 16,
            marginHorizontal: 16,
            // no gap, use padding left and right so whitespace is scrollable
          }}
        >
          {dailyArr.map((hour, index) => (
            <HourlyForecastItem
              key={hour?.fullDate}
              hour={hour}
              index={index}
              dailyArr={getHourlyForecastObject(data[cityName], americanTime)}
              showModal={showModal}
            />
          ))}
        </ScrollView>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(HourlyForecast);
