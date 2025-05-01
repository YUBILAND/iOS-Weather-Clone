import { View, Text, TextStyle } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";

type RoundedTemperatureProps = {
  temperature: number | string;
  className?: string;
  style?: TextStyle;
  unit?: string;
};

const RoundedTemperature = ({
  temperature,
  className,
  style,
  unit = "°",
}: RoundedTemperatureProps) => {
  return (
    <DefaultText className={className} style={style}>
      {typeof temperature === "number" ? temperature + unit : temperature}
    </DefaultText>
  );
};

export default RoundedTemperature;
