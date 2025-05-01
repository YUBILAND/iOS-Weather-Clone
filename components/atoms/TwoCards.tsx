import { View, Text } from "react-native";
import React from "react";

interface TwoCardsProps {
  leftCard: React.ReactNode;
  rightCard: React.ReactNode;
}

const TwoCards = ({ leftCard, rightCard }: TwoCardsProps) => {
  return (
    <View className="flex-row gap-x-2 h-48 ">
      <View
        className="flex-[0.5]"
        style={{ borderRadius: 10, overflow: "hidden" }}
      >
        {leftCard}
      </View>
      <View
        className="flex-[0.5]"
        style={{ borderRadius: 10, overflow: "hidden" }}
      >
        {rightCard}
      </View>
    </View>
  );
};

export default React.memo(TwoCards);
