import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TrashButtonProps {
  handleRemove: () => void;
}
const TrashButton = ({ handleRemove }: TrashButtonProps) => {
  return (
    <>
      <AnimatedPressable
        onPress={() => handleRemove()}
        className="bg-red-600 rounded-xl justify-center items-center "
        style={{ width: 60, height: 60, zIndex: 100 }}
      >
        <Ionicons name="trash" size={24} color={"white"} />
      </AnimatedPressable>
    </>
  );
};

export default TrashButton;
