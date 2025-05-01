import { View, Text, TextStyle } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";
import RoundedTemperature from "./RoundedTemperature";

const HighsAndLows = ({
  high,
  low,
  textClasses,
  style,
}: {
  high: number;
  low: number;
  textClasses: string;
  style?: TextStyle;
}) => {
  return (
    <>
      <DefaultText className={textClasses} style={style}>
        H:
        <RoundedTemperature temperature={high} />
      </DefaultText>
      <DefaultText className={textClasses} style={style}>
        L:
        <RoundedTemperature temperature={low} />
      </DefaultText>
    </>
  );
};

export default HighsAndLows;
