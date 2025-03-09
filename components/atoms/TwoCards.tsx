import { View, Text } from "react-native";
import React from "react";

interface TwoCardsProps {
  leftCard: React.ReactNode;
  rightCard: React.ReactNode;
}

const TwoCards = ({ leftCard, rightCard }: TwoCardsProps) => {
  return (
    <View className="flex-row gap-x-2 h-48">
      <View className="flex-[0.5]">{leftCard}</View>
      <View className="flex-[0.5]">{rightCard}</View>
    </View>
  );
};

export default TwoCards;
