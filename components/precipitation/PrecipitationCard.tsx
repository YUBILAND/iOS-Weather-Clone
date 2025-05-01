import { useWeatherData } from "@/hooks/useWeatherData";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import CardBottomText from "../atoms/CardBottomText";
import CardStat from "../atoms/CardStat";
import CardTitle from "../atoms/CardTitle";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { getPrecipitation } from "@/hooks/useDisplayUnits";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface PrecipitationCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const PrecipitationCard = ({
  cityName,
  showModal,
  iconSize,
  collapseFromTopStyle,
}: PrecipitationCardProps) => {
  const data = useWeatherData();
  const { forecast } = data[cityName];
  const precipUnit = useOtherUnits()["precipitation"];

  const precipTemp =
    Math.round(
      getPrecipitation(forecast.forecastday[0].day.totalprecip_in)
    ).toString() + (precipUnit === "in" ? '"' : "mm");

  const message = "in last 24h";
  const message2 = "Later there will be more rain or something";

  return (
    <OpacityCard className="h-full">
      <Pressable
        className="px-4 gap-y-2 "
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title={"Precipitation"}
          icon={
            <FontAwesome6
              name="cloud-showers-heavy"
              size={iconSize}
              color={"white"}
            />
          }
        />

        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <CardStat stat={precipTemp} />

            <CardBottomText text={message} />

            <DefaultText style={{ fontSize: 14, lineHeight: 14 }}>
              {message2}
            </DefaultText>
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(PrecipitationCard);
