import { View, Text, Pressable } from "react-native";
import React from "react";
import DefaultText from "@/components/atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
interface SmallTextProps {
  text: string;
}
const SmallText = ({ text }: SmallTextProps) => {
  return (
    <>
      <DefaultText style={{ fontSize: 12, color: colors.lightGray }}>
        {text}
      </DefaultText>
    </>
  );
};

export default SmallText;
