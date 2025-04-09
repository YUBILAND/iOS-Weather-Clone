import { View, Text } from "react-native";
import React from "react";
import DefaultText from "@/components/atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import { FontAwesome6 } from "@expo/vector-icons";

interface MultipleOptionsIconProps {
  text: string;
}
const MultipleOptionsIcon = ({ text }: MultipleOptionsIconProps) => {
  return (
    <View className="flex-row items-center gap-2">
      <DefaultText style={{ color: colors.lightGray, fontSize: 16 }}>
        {text}
      </DefaultText>
      <FontAwesome6 name="arrows-up-down" color={colors.lightGray} size={16} />
    </View>
  );
};

export default MultipleOptionsIcon;
