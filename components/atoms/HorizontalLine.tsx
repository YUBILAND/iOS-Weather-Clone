import { View } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";

interface HorizontalLineProps {
  color?: string;
  size?: number;
  children?: React.ReactNode;
  className?: string;
}

const HorizontalLine = ({
  className,
  color = "normal",
  size = 1,
  children,
}: HorizontalLineProps) => {
  return (
    <View
      className={`h-0 w-full relative ${className}`}
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
