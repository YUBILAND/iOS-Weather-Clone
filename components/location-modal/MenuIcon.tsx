import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/assets/colors/colors";
import { Entypo } from "@expo/vector-icons";

interface MenuIconProps {
  size: number;
  isEditingList: boolean;
}
const MenuIcon = ({ size, isEditingList }: MenuIconProps) => {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = isEditingList ? size : 0;
  }, [isEditingList]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(width.value, { duration: 300 }),
      height: size,
    };
  });
  return (
    <Animated.View style={animatedStyle}>
      <Entypo name="menu" size={size} color={colors.mediumGray} />
    </Animated.View>
  );
};

export default MenuIcon;
