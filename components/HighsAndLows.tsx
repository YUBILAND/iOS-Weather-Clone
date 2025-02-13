import { View, Text } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";
import RoundedTemperature from "./RoundedTemperature";

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
      <DefaultText className={textClasses}>
        H:
        <RoundedTemperature temperature={high} />
      </DefaultText>
      <DefaultText className={textClasses}>
        L:
        <RoundedTemperature temperature={low} />
      </DefaultText>
    </View>
  );
};

export default HighsAndLows;
