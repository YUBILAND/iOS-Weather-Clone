import { View, Text } from "react-native";
import React from "react";

interface DotProps {
  color: string;
  size?: number;
}

const Dot = ({ color, size = 10 }: DotProps) => {
  return (
    <View
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: "50%",
      }}
    />
  );
};

export default Dot;
