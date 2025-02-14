import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import CloseButton from "./CloseButton";
import DefaultText from "./DefaultText";

const ModalHeader = ({ toggleVisible }: { toggleVisible: () => void }) => {
  return (
    <>
      <View className="opacity-0">
        <CloseButton diameter={35} size={25} />
      </View>
      <View className="flex-row items-center gap-x-4">
        <Image
          source={require("../assets/images/partlycloudy-night.png")}
          className="w-8 h-8"
        />
        <DefaultText className="font-semibold text-xl">Conditions</DefaultText>
      </View>

      <TouchableOpacity onPress={toggleVisible}>
        <CloseButton diameter={35} size={25} />
      </TouchableOpacity>
    </>
  );
};

export default ModalHeader;
