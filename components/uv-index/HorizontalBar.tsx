import { View, Text, DimensionValue } from "react-native";
import React, { useRef, useState } from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";

type HorizontalBarColor = "light" | "dark";

interface HorizontalBarProps {
  title: string;
  bgColor: HorizontalBarColor;
  currentHigh: string;
  percentage: number;
}

const HorizontalBar = ({
  title,
  bgColor,
  currentHigh,
  percentage,
}: HorizontalBarProps) => {
  //   console.log(percentage);
  return (
    <View className="flex-row gap-x-2 ">
      <Text
        className="font-semibold py-1 pl-2"
        style={{
          color: bgColor === "light" ? colors.darkGray : colors.bgWhite(0.8),
          backgroundColor:
            bgColor === "light" ? colors.bgWhite(0.8) : colors.bgWhite(0.2),
          borderRadius: 2,
          flex: percentage,

          // width: ((percentage * 100).toString() + "%") as DimensionValue,
        }}
      >
        {title}
      </Text>
      <View style={{ flex: 0 }} className="  justify-center items-center">
        <DefaultText className="font-semibold" style={{ fontSize: 20 }}>
          {currentHigh}
        </DefaultText>
      </View>
    </View>
  );
};

export default HorizontalBar;
