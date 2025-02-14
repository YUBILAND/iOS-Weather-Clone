import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import { FontAwesome6 } from "@expo/vector-icons";

const CloseButton = ({
  diameter,
  size,
}: {
  diameter: number;
  size: number;
}) => {
  return (
    <View
      className="flex-row justify-center items-center"
      style={{
        backgroundColor: colors.mediumGray,
        borderRadius: 100,
        width: diameter,
        height: diameter,
      }}
    >
      <FontAwesome6 name="xmark" color={colors.lightGray} size={size} />
    </View>
  );
};

export default CloseButton;
