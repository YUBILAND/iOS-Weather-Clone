import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { Easing, FadeOutUp } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TrashButtonProps {
  handleRemove: () => void;
}
const TrashButton = ({ handleRemove }: TrashButtonProps) => {
  return (
    <>
      <AnimatedPressable
        onPress={() => handleRemove()}
        className="bg-red-600 rounded-xl justify-center items-center absolute top-0 left-full"
        style={{ width: 60, height: 60, zIndex: 100 }}
      >
        <Ionicons name="trash" size={24} color={"white"} />
      </AnimatedPressable>
    </>
  );
};

export default TrashButton;
