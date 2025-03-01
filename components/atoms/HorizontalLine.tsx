import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";

interface HorizontalLineProps {
  color?: string;
  size?: number;
  children?: React.ReactNode;
}

const HorizontalLine = ({
  color = "normal",
  size = 1,
  children,
}: HorizontalLineProps) => {
  return (
    <View // Horizontal line
      className="h-0 w-full relative"
      style={{
        borderTopWidth: size,
        borderTopColor: color === "normal" ? colors.bgWhite(0.2) : color,
      }}
    >
      {children}
    </View>
  );
};

export default HorizontalLine;
