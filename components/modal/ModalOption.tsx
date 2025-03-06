import { View, Text } from "react-native";
import React from "react";
import ModalBoxTitle from "./ModalBoxTitle";
import ModalTextBoxContainer from "./ModalTextBoxContainer";
import DefaultText from "../atoms/DefaultText";
import { FontAwesome6 } from "@expo/vector-icons";
import { colors } from "@/assets/colors/colors";

interface ModalOptionProps {
  title: string;
}

const ModalOption = ({ title }: ModalOptionProps) => {
  return (
    <View>
      <ModalBoxTitle title={title} />

      <ModalTextBoxContainer>
        <View className="flex-row justify-between">
          <DefaultText>Metric</DefaultText>
          <View className="flex-row items-center gap-x-2">
            <DefaultText>Use system settings (C°)</DefaultText>
            <FontAwesome6
              name="arrows-up-down"
              color={colors.lightGray}
              size={16}
            />
          </View>
        </View>
      </ModalTextBoxContainer>
    </View>
  );
};

export default ModalOption;
