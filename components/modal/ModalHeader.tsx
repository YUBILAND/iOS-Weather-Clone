import { View, Text, Image, TouchableOpacity, ColorValue } from "react-native";
import React from "react";
import CloseButton from "../atoms/CloseButton";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";

interface ModalHeaderProps {
  closeModal: (visible: boolean) => void;
  title: string;
  children: React.ReactNode;
  outerColor?: ColorValue;
  innerColor?: ColorValue;
  textColor?: ColorValue;
}

const ModalHeader = ({
  closeModal,
  title,
  children,
  outerColor = colors.mediumGray,
  innerColor = colors.lightGray,
  textColor = "white",
}: ModalHeaderProps) => {
  return (
    <>
      <View className="opacity-0">
        <CloseButton diameter={35} size={25} />
      </View>
      <View className="flex-row items-center gap-x-2">
        {/* Put image here */}
        {children}

        <DefaultText
          style={{ color: textColor }}
          className="font-semibold text-xl"
        >
          {title}
        </DefaultText>
      </View>

      <TouchableOpacity onPress={() => closeModal(false)}>
        <CloseButton
          outerColor={outerColor}
          innerColor={innerColor}
          diameter={35}
          size={25}
        />
      </TouchableOpacity>
    </>
  );
};

export default ModalHeader;
