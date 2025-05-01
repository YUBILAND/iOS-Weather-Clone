import { colors } from "@/assets/colors/colors";
import DefaultText from "@/components/atoms/DefaultText";
import React from "react";
import { View } from "react-native";

interface SettingsTextBoxContainerProps {
  title: string;
  children: React.ReactNode;
}
const SettingsTextBoxContainer = ({
  title,
  children,
}: SettingsTextBoxContainerProps) => {
  return (
    <View className="pb-8">
      <View className="pl-4 py-2 ">
        <DefaultText className="uppercase" style={{ color: colors.lightGray }}>
          {title}
        </DefaultText>
      </View>
      <View
        style={{ backgroundColor: colors.mediumGray }}
        className=" w-full px-4 py-4 rounded-lg gap-3 "
      >
        {children}
      </View>
    </View>
  );
};

export default SettingsTextBoxContainer;
