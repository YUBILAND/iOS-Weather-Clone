import { View, Text } from "react-native";
import React from "react";
import ModalBoxTitle from "./ModalBoxTitle";
import ModalTextBoxContainer from "./ModalTextBoxContainer";
import DefaultText from "../atoms/DefaultText";

interface ModalTextBoxProps {
  title: string;
  children: React.ReactNode;
  removeHorizontalPadding?: boolean;
}

const ModalTextBox = ({
  title,
  children,
  removeHorizontalPadding = false,
}: ModalTextBoxProps) => {
  return (
    <View>
      <ModalBoxTitle title={title} />

      <ModalTextBoxContainer removeHorizontalPadding={removeHorizontalPadding}>
        {children}
      </ModalTextBoxContainer>
    </View>
  );
};

export default ModalTextBox;
