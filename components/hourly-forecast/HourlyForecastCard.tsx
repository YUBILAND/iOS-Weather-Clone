import { colors } from "@/assets/colors/colors";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useCallback, useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import HourlyForecastItem from "./HourlyForecastItem";
import { getHourlyForecastObject } from "./utils/getHourlyForecast";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { getTemperature } from "@/hooks/getTemperature";

interface HourlyForecastProps {
  cityName: string;
  showModal: () => void;
}

const HourlyForecast = ({ cityName, showModal }: HourlyForecastProps) => {
  const data = useWeatherData();
  const tempUnit = useTemperatureUnit();

  const dailyArr = useMemo(
    () => getHourlyForecastObject(data[cityName]),
    [data, cityName]
  );

  const weatherMessage = "Random text related to today's weather";

  const handlePress = useCallback(() => {
    showModal();
  }, [showModal]);
  return (
    <OpacityCard>
      <Pressable className="gap-y-3 " onPress={handlePress}>
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
          {dailyArr.map((hour, index) => {
            const isNumber = typeof hour?.celsius === "number";
            const temperature = isNumber
              ? getTemperature(hour?.celsius as number, tempUnit)
              : hour?.celsius;
            return (
              <HourlyForecastItem
                key={hour?.fullDate}
                hour={hour}
                index={index}
                temperature={temperature}
                dailyArr={dailyArr}
                showModal={showModal}
              />
            );
          })}
        </ScrollView>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(HourlyForecast);
