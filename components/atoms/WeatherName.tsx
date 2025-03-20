import { View, Text, TextStyle } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";

const WeatherName = ({
  weatherName,
  className,
  style,
}: {
  weatherName?: string;
  className: string;
  style?: TextStyle;
}) => {
  return (
    <DefaultText style={style} className={className}>
      {weatherName}
    </DefaultText>
  );
};

export default WeatherName;
