import { View, Text, ColorValue } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import Dot from "../modal/Dot";

interface DotTextProps {
  dotColor: string | undefined;
  text: string | undefined;
}
const DotText = ({ dotColor, text }: DotTextProps) => {
  return (
    <View className="flex-row items-center gap-x-2">
      {dotColor ? <Dot colorsArr={[dotColor, dotColor]} /> : null}
      <DefaultText className="font-semibold text-lg">{text}</DefaultText>
    </View>
  );
};

export default DotText;
