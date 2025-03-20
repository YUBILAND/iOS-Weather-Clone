import { colors } from "@/assets/colors/colors";
import React from "react";
import { View } from "react-native";
import DefaultText from "../../atoms/DefaultText";

interface WindCardInfoItemProps {
  windSpeed: number;
  measurement: string;
}

const WindCardInfoItem = ({
  windSpeed,
  measurement,
}: WindCardInfoItemProps) => {
  return (
    <View className="flex-row gap-x-4 ">
      <View className="flex-[0.3] items-end">
        <DefaultText style={{ fontSize: 40 }}>{windSpeed}</DefaultText>
      </View>

      <View className="justify-center flex-[0.7]">
        <DefaultText style={{ color: colors.lightGray }}>MPH</DefaultText>
        <DefaultText className="font-semibold">{measurement}</DefaultText>
      </View>
    </View>
  );
};

export default WindCardInfoItem;
