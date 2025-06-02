import { View, Text, ColorValue } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import { FontAwesome6 } from "@expo/vector-icons";

const CloseButton = ({
  diameter,
  size,
  outerColor = colors.mediumGray,
  innerColor = colors.lightGray,
}: {
  diameter: number;
  size: number;
  outerColor?: ColorValue;
  innerColor?: ColorValue;
}) => {
  return (
    <View
      className="flex-row justify-center items-center"
      style={{
        backgroundColor: outerColor,
        borderRadius: 100,
        width: diameter,
        height: diameter,
      }}
    >
      <FontAwesome6 name="xmark" color={innerColor} size={size} />
    </View>
  );
};

export default CloseButton;
