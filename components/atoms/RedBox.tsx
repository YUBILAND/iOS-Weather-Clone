import React from "react";
import { Pressable, ViewStyle } from "react-native";
import DefaultText from "./DefaultText";

interface RedBoxProps {
  onPress?: () => void;
  text?: string;
  className?: string;
  style?: ViewStyle;
}
const RedBox = ({ onPress, text, className, style }: RedBoxProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={className}
      style={[{ width: 64, height: 64, backgroundColor: "red" }, style]}
    >
      <DefaultText className="items-center">{text}</DefaultText>
    </Pressable>
  );
};

export default RedBox;
