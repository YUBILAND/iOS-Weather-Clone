import { colors } from "@/assets/colors/colors";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";

interface MoonPhaseInfoItemProps {
  text: string;
  value: string;
}

const MoonPhaseInfoItem = ({ text, value }: MoonPhaseInfoItemProps) => {
  return (
    <View className="flex-row justify-between">
      <View className=" py-2">
        <DefaultText style={{ fontSize: 15 }}>{text}</DefaultText>
      </View>

      <View className="justify-center ">
        <DefaultText style={{ color: colors.lightGray }}>{value}</DefaultText>
      </View>
    </View>
  );
};

export default MoonPhaseInfoItem;
