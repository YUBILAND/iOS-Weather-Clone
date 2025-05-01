import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import CardTitle from "../../atoms/CardTitle";
import OpacityCard from "../../atoms/OpacityCard";
import WindCardContent from "./WindCardContent";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface WindCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const WindCard = ({
  cityName,
  showModal,
  iconSize,
  collapseFromTopStyle,
}: WindCardProps) => {
  return (
    <OpacityCard className="px-4 gap-y-2">
      <Pressable
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title="Wind"
          icon={<FontAwesome6 name="wind" color="white" size={iconSize} />}
        />

        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <WindCardContent cityName={cityName} />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(WindCard);
