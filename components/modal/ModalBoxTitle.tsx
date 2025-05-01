import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";

const ModalBoxTitle = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle?: string;
}) => {
  return (
    <View className="mb-3 mt-6 pl-2 justify-center gap-1">
      <DefaultText style={{ fontSize: 22, lineHeight: 22, fontWeight: 700 }}>
        {title}
      </DefaultText>
      {subTitle && (
        <DefaultText
          // className="text-lg font-semibold "
          style={{ fontSize: 16, lineHeight: 16, color: colors.lightGray }}
        >
          {subTitle}
        </DefaultText>
      )}
    </View>
  );
};

export default ModalBoxTitle;
