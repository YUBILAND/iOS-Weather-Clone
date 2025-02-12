import { View, Text } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";

const HighsAndLows = ({
  high,
  low,
  className,
  textClasses,
}: {
  high: string;
  low: string;
  className: string;
  textClasses: string;
}) => {
  return (
    <View className={className}>
      <DefaultText className={textClasses}>H:{high}&#176;</DefaultText>
      <DefaultText className={textClasses}>L:{low}&#176;</DefaultText>
    </View>
  );
};

export default HighsAndLows;
