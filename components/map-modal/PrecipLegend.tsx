import { colors } from "@/assets/colors/colors";
import { BlurView } from "expo-blur";
import React from "react";
import { View, Text } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import VerticalColoredBar from "./VerticalColoredBar";

interface PrecipLegendProps {
  cityName: string;
}
const PrecipLegend = ({ cityName }: PrecipLegendProps) => {
  //   const gradientColors: readonly [string, string, ...string[]] = [
  //     "#00df72",
  //     "#f5e536",
  //     "#fc9003",
  //     "#f51458",
  //     "#ad02f6",
  //     "#82162c",
  //     "#82162c",
  //   ];

  const gradientColors: readonly [string, string, ...string[]] = [
    "#1790F9FF",
    "#7EFF4F",
    "#FF4545",
    "#924CBEFF",
  ];

  return (
    <BlurView
      style={{
        backgroundColor: colors.mediumGray,
        borderRadius: 10,
        paddingVertical: 14,
        // paddingHorizontal: 20,
        alignSelf: "flex-start",
        overflow: "hidden",
        gap: 12,
      }}
    >
      <View className="px-4">
        <DefaultText>Precipitation</DefaultText>
      </View>

      <View>
        <HorizontalLine />
      </View>
      <View className="px-4 flex-row items-center gap-x-6 h-32">
        <View className="flex-1">
          <VerticalColoredBar
            cityName={cityName}
            colorsArr={gradientColors}
            //   locationsArr={[0.05, 0.2, 0.3, 0.4, 0.5, 0.8, 1]}
            locationsArr={[0, 0.34, 0.72, 0.93]}
            //   height={140}
          />
        </View>

        {/* <DefaultText>Bar</DefaultText> */}
        <View className="gap-y-4 ">
          <DefaultText>Extreme</DefaultText>
          <DefaultText>Heavy</DefaultText>
          <DefaultText>Moderate</DefaultText>
          <DefaultText>Light</DefaultText>
        </View>
      </View>
    </BlurView>
  );
};

export default React.memo(PrecipLegend);
