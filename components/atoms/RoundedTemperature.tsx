import { View, Text, TextStyle } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";

type RoundedTemperatureProps = {
  temperature: number | string;
  className?: string;
  style?: TextStyle;
};

const RoundedTemperature = ({
  temperature,
  className,
  style,
}: RoundedTemperatureProps) => {
  return (
    <DefaultText className={className} style={style}>
      {typeof temperature === "number"
        ? Math.round(temperature) + "°"
        : temperature}
    </DefaultText>
  );
};

export default RoundedTemperature;
