import { useWeatherData } from "@/hooks/useWeatherData";
import React, { MutableRefObject } from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import CardTitle from "../atoms/CardTitle";
import OpacityCard from "../atoms/OpacityCard";
import DailyForecastItem from "./DailyForecastItem";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { colors } from "@/assets/colors/colors";
import HorizontalLine from "../atoms/HorizontalLine";

interface DailyForecastCardProps {
  cityName: string;
  showModal: () => void;
  setCurrentIndex: (index: number) => void;
  openModalOnIndexRef: MutableRefObject<boolean>;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const DailyForecastCard: React.FC<DailyForecastCardProps> = ({
  cityName,
  showModal,
  setCurrentIndex,
  openModalOnIndexRef,
  iconSize,
  collapseFromTopStyle,
}) => {
  const data = useWeatherData();
  const { forecast } = data[cityName];

  return (
    <OpacityCard className="px-4">
      <Pressable className="gap-y-3">
        <CardTitle
          title={"3-Day Forecast (FORECAST API FREE PLAN)"}
          icon={<CalendarDaysIcon size={iconSize} color={"white"} />}
        />

        <View className="overflow-hidden ">
          <Animated.View style={collapseFromTopStyle} className="gap-y-3">
            <HorizontalLine />

            <ScrollView
              contentContainerStyle={{
                marginHorizontal: 0,
              }}
              showsHorizontalScrollIndicator={false}
            >
              <View className="gap-y-3">
                {forecast?.forecastday.map((item, index) => (
                  <DailyForecastItem
                    key={index}
                    data={data[cityName]}
                    item={item}
                    index={index}
                    showModal={showModal}
                    setCurrentIndex={setCurrentIndex}
                    openModalOnIndexRef={openModalOnIndexRef}
                  />
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(DailyForecastCard);
