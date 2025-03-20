import { View, Text, TextStyle } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";
import RoundedTemperature from "./RoundedTemperature";

const HighsAndLows = ({
  high,
  low,
  className,
  textClasses,
  style,
}: {
  high: number;
  low: number;
  className: string;
  textClasses: string;
  style?: TextStyle;
}) => {
  return (
    <View className={className}>
      <DefaultText className={textClasses} style={style}>
        H:
        <RoundedTemperature temperature={high} />
      </DefaultText>
      <DefaultText className={textClasses} style={style}>
        L:
        <RoundedTemperature temperature={low} />
      </DefaultText>
    </View>
  );
};

export default HighsAndLows;
