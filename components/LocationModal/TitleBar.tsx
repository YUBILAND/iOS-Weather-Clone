import { View, Text } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DefaultText from "../atoms/DefaultText";

interface TitleBarProps {
  text: string;
  visible: boolean;
  handleSettingsModal: () => void;
}
const TitleBar = ({ text, visible, handleSettingsModal }: TitleBarProps) => {
  return (
    <View
      style={{ height: 80 }}
      className="w-full flex-row justify-between z-30 items-end"
    >
      <MaterialCommunityIcons
        name="dots-horizontal-circle-outline"
        size={24}
        color="transparent"
        onPress={handleSettingsModal}
      />
      <DefaultText style={{ opacity: visible ? 1 : 0 }} className="text-lg">
        {text}
      </DefaultText>
      <MaterialCommunityIcons
        name="dots-horizontal-circle-outline"
        size={24}
        color={"white"}
        onPress={handleSettingsModal}
      />
    </View>
  );
};

export default TitleBar;
