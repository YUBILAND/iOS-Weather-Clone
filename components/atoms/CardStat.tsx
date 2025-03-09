import { View, Text } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";

interface CardStatProps {
  stat: string;
}
const CardStat = ({ stat }: CardStatProps) => {
  return (
    <DefaultText
      className="font-semibold"
      style={{ fontSize: 30, lineHeight: 30 }}
    >
      {stat}
    </DefaultText>
  );
};

export default CardStat;
