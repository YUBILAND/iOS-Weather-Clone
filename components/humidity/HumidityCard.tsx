import { RootState } from "@/state/store";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { EyeIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import ColoredBar from "../atoms/ColoredBar";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { colors } from "@/assets/colors/colors";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import CardTitle from "../atoms/CardTitle";
import CardStat from "../atoms/CardStat";
import CardText from "../atoms/CardBottomText";
import CardBottomText from "../atoms/CardBottomText";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface HumidityCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const HumidityCard = ({
  cityName,
  showModal,
  iconSize,
  collapseFromTopStyle,
}: HumidityCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];

  const currentHumidity = Math.round(current.humidity).toString() + "%";

  const message = "random message";

  return (
    <OpacityCard>
      <Pressable
        className="px-4 gap-y-2 h-full"
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title={"Humidity"}
          icon={<FontAwesome6 name="droplet" size={iconSize} color={"white"} />}
        />
        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <CardStat stat={currentHumidity} />

            <CardBottomText text={message} />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(HumidityCard);
