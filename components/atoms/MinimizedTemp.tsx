import { View, Text, StyleProp, TextStyle } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";

interface MinimizedTempProps {
  currentTemp: number;
  currentCondition: string;
  style: StyleProp<TextStyle>;
  viewTw: string;
}

const MinimizedTemp = ({
  currentTemp,
  currentCondition,
  style,
  viewTw,
}: MinimizedTempProps) => {
  return (
    <View className={viewTw}>
      <DefaultText className="text-xl font-semibold" style={style}>
        {currentTemp + "°"}
      </DefaultText>
      <DefaultText className="text-xl font-semibold" style={style}>
        |
      </DefaultText>
      <DefaultText className="text-xl font-semibold" style={style}>
        {currentCondition}
      </DefaultText>
    </View>
  );
};

export default MinimizedTemp;
