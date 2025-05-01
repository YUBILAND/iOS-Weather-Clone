import { RootState } from "@/state/store";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { EyeIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import CardBottomText from "../atoms/CardBottomText";
import CardStat from "../atoms/CardStat";
import CardTitle from "../atoms/CardTitle";
import OpacityCard from "../atoms/OpacityCard";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface VisibilityCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const VisibilityCard = ({
  cityName,
  showModal,
  iconSize,
  collapseFromTopStyle,
}: VisibilityCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];

  const currentVisibility = Math.round(current.vis_miles).toString() + " mi";

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
          title={"Visibility"}
          icon={<EyeIcon size={iconSize} color={"white"} />}
        />
        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <CardStat stat={currentVisibility} />

            <CardBottomText text={message} />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(VisibilityCard);
