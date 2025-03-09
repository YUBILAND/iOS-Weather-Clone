import { View, Text } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";
import { colors } from "@/assets/colors/colors";
interface CardTextProps {
  text: string;
  className?: string;
}
const CardBottomText = ({ text, className }: CardTextProps) => {
  return (
    <DefaultText style={{ color: "white" }} className={className}>
      {text}
    </DefaultText>
  );
};

export default CardBottomText;
