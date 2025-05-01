import { useWeatherData } from "@/hooks/useWeatherData";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import CardBottomText from "../atoms/CardBottomText";
import CardStat from "../atoms/CardStat";
import CardTitle from "../atoms/CardTitle";
import OpacityCard from "../atoms/OpacityCard";
import { getTemperature } from "@/hooks/useDisplayUnits";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface WindChillCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const WindChillCard = ({
  cityName,
  showModal,
  iconSize,
  collapseFromTopStyle,
}: WindChillCardProps) => {
  const data = useWeatherData();
  const { current } = data[cityName];

  const windChillTemp =
    Math.round(getTemperature(current.windchill_c)).toString() + "°";

  const message = "feels like something";

  return (
    <OpacityCard className="h-full">
      <Pressable
        className="px-4 gap-y-2 "
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title={"Feels Like"}
          icon={
            <FontAwesome
              name="thermometer-empty"
              color={"white"}
              size={iconSize}
            />
          }
        />
        <View className="overflow-hidden ">
          <Animated.View style={collapseFromTopStyle} className="gap-y-2">
            <CardStat stat={windChillTemp} />

            <CardBottomText text={message} />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(WindChillCard);
