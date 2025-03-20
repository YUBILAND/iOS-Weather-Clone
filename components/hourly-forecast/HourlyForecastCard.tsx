import { colors } from "@/assets/colors/colors";
import { RootState } from "@/state/store";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import HourlyForecastItem from "./HourlyForecastItem";
import { DailyStats } from "./utils/constants";
import { getHourlyForecastObject } from "./utils/getHourlyForecast";
import { useAmericanTime } from "@/hooks/useAmericanTime";
import { useWeatherData } from "@/hooks/useWeatherData";

interface HourlyForecastProps {
  cityName: string;
  showModal: () => void;
}

const HourlyForecast = ({ cityName, showModal }: HourlyForecastProps) => {
  const americanTime = useAmericanTime();
  const data = useWeatherData();
  const { location, forecast } = data[cityName];

  const [dailyArr, setDailyArr] = useState<DailyStats[]>([]);

  useEffect(() => {
    if (location)
      setDailyArr(getHourlyForecastObject(data[cityName], americanTime));
  }, []);

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
              dailyArr={dailyArr}
              showModal={showModal}
            />
          ))}
        </ScrollView>
      </Pressable>
    </OpacityCard>
  );
};

export default HourlyForecast;
