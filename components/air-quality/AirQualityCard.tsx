import { View, Text, Pressable, StyleProp, ViewStyle } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import ColoredBar from "../atoms/ColoredBar";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import OpacityCard from "../atoms/OpacityCard";
import getFont from "@/hooks/getFont";
import { getAQI } from "./utils/getAQI";
import { getAQIRating } from "./utils/getAQIRating";
import { getAQIMessage } from "./utils/getAQIMessage";
import CardTitle from "../atoms/CardTitle";
import CardBottomText from "../atoms/CardBottomText";
import { pm25_aqi } from "./utils/constants";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface AirQualityCardProps {
  cityName: string;
  iconSize: number;
  showModal: () => void;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const AirQualityCard = ({
  cityName,
  iconSize,
  showModal,
  collapseFromTopStyle,
}: AirQualityCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

  const AQI = getAQI(data[cityName]);
  const rating = getAQIRating(AQI);
  const message = getAQIMessage(AQI);

  const realAQI = pm25_aqi(data[cityName].current?.air_quality.pm2_5);
  // console.log(realAQI);

  const gradientColors: readonly [string, string, ...string[]] = [
    "#00df72",
    "#f5e536",
    "#fc9003",
    "#f51458",
    "#ad02f6",
    "#82162c",
    "#82162c",
  ];

  return (
    <OpacityCard className="px-4">
      <Pressable className=" gap-y-2" onPress={showModal}>
        <CardTitle
          title={"Air Quality"}
          icon={<CalendarDaysIcon size={iconSize} color={"white"} />}
        />

        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <DefaultText className="text-4xl font-semibold">{AQI}</DefaultText>
            <DefaultText className="text-xl font-semibold">
              {rating}
            </DefaultText>

            <ColoredBar
              cityName={cityName}
              index={AQI}
              maxIndex={500}
              label={"AQI"}
              colorsArr={gradientColors}
              locationsArr={[0.05, 0.2, 0.3, 0.4, 0.5, 0.8, 1]}
            />

            <CardBottomText className="pt-2" text={message} />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(AirQualityCard);
