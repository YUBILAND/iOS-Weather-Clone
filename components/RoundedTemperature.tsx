import { View, Text, TextStyle } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";

type RoundedTemperatureProps = {
  temperatureString: string;
  className?: string;
  style?: TextStyle;
};

const RoundedTemperature = ({
  temperatureString,
  className,
  style,
}: RoundedTemperatureProps) => {
  return (
    <DefaultText className={className} style={style}>
      {Math.round(parseInt(temperatureString))}&#176;
    </DefaultText>
  );
};

export default RoundedTemperature;
