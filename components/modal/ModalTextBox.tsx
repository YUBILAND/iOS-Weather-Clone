import { View, Text } from "react-native";
import React from "react";
import ModalBoxTitle from "./ModalBoxTitle";
import ModalTextBoxContainer from "./ModalTextBoxContainer";
import DefaultText from "../atoms/DefaultText";

interface ModalTextBoxProps {
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  removeHorizontalPadding?: boolean;
}

const ModalTextBox = ({
  title,
  subTitle,
  children,
  removeHorizontalPadding = false,
}: ModalTextBoxProps) => {
  return (
    <View>
      <ModalBoxTitle title={title} subTitle={subTitle} />

      <ModalTextBoxContainer removeHorizontalPadding={removeHorizontalPadding}>
        {children}
      </ModalTextBoxContainer>
    </View>
  );
};

export default ModalTextBox;
