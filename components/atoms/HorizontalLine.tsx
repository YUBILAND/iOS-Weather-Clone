import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";

const HorizontalLine = () => {
  return (
    <Text // Horizontal line
      className="h-0"
      style={{ borderTopWidth: 1, borderTopColor: colors.bgWhite(0.2) }}
    />
  );
};

export default HorizontalLine;
