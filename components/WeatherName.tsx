import { View, Text } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";

const WeatherName = ({
  weatherName,
  className,
}: {
  weatherName?: string;
  className: string;
}) => {
  return <DefaultText className={className}>{weatherName}</DefaultText>;
};

export default WeatherName;
