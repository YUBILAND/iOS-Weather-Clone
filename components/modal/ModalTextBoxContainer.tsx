import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";

interface ModalTextBoxContainerProps {
  children: React.ReactNode;
  removeHorizontalPadding?: boolean;
}

const ModalTextBoxContainer = ({
  children,
  removeHorizontalPadding = false,
}: ModalTextBoxContainerProps) => {
  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: colors.mediumGray,
        paddingHorizontal: removeHorizontalPadding ? 0 : 16,
        paddingVertical: 12,
        gap: 12,
      }}
    >
      {children}
    </View>
  );
};

export default ModalTextBoxContainer;
