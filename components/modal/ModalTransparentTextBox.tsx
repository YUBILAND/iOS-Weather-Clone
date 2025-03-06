import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";

interface ModalTransparentTextBoxProps {
  title: string;
  description: string;
}

const ModalTransparentTextBox = ({
  title,
  description,
}: ModalTransparentTextBoxProps) => {
  return (
    <View className="pl-2 mt-4 gap-y-2">
      <DefaultText className="font-semibold">{title}</DefaultText>
      <DefaultText>{description}</DefaultText>
    </View>
  );
};

export default ModalTransparentTextBox;
