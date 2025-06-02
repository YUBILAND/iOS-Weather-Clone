import { colors } from "@/assets/colors/colors";
import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useCallback, useMemo } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import HourlyForecastItem from "./HourlyForecastItem";
import { getHourlyForecastObject } from "./utils/getHourlyForecast";
import { getTemperature } from "@/hooks/useDisplayUnits";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { useLayout } from "@/hooks/useLayout";
import HorizontalLine from "../atoms/HorizontalLine";
import VisualHeightChange from "@/hooks/VisualHeightChange";

interface HourlyForecastProps {
  cityName: string;
  showModal: () => void;
  style: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  title: React.ReactNode;
}

const HourlyForecast = ({
  cityName,
  showModal,
  style,
  title,
}: HourlyForecastProps) => {
  const data = useWeatherData();

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
      <Pressable className="gap-y-3" onPress={handlePress}>
        {title}

        <View className="overflow-hidden ">
          <Animated.View style={style} className="gap-y-3">
            <HorizontalLine className="ml-4" />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingRight: 16,
                marginHorizontal: 16,
              }}
            >
              {dailyArr.map((hour, index) => {
                const isNumber = typeof hour?.celsius === "number";
                const temperature = isNumber
                  ? Math.round(getTemperature(hour?.celsius as number))
                  : // Would be sunrise/ sunset text so show that, no need to convert units
                    hour?.celsius;
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
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(HourlyForecast);
