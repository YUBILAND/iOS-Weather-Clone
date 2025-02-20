import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import CloseButton from "./CloseButton";
import DefaultText from "./DefaultText";

interface ModalHeaderProps {
  closeModal: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalHeader = ({ closeModal, title, children }: ModalHeaderProps) => {
  return (
    <>
      <View className="opacity-0">
        <CloseButton diameter={35} size={25} />
      </View>
      <View className="flex-row items-center gap-x-2">
        {/* Put image here */}
        {children}

        <DefaultText className="font-semibold text-xl">{title}</DefaultText>
      </View>

      <TouchableOpacity onPress={closeModal}>
        <CloseButton diameter={35} size={25} />
      </TouchableOpacity>
    </>
  );
};

export default ModalHeader;
