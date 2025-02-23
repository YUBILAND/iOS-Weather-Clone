import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";

const ModalBoxTitle = ({ title }: { title: string }) => {
  return (
    <View className="h-12 pl-2 mt-2 justify-center">
      <DefaultText className="text-2xl font-semibold ">{title}</DefaultText>
    </View>
  );
};

export default ModalBoxTitle;
