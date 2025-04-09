import { View, Text, Pressable } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DefaultText from "../atoms/DefaultText";
import { SelectSetting } from "../modal/utils/modalConstants";

interface TitleBarProps {
  text: string;
  visible: boolean;
  handleSettingsModal: () => void;
  selectedSetting: SelectSetting | null;
  chooseSetting: (setting: SelectSetting | null) => void;
  handleConfirmDeleteIndex: (index: number | null) => void;
}
const TitleBar = ({
  text,
  visible,
  handleSettingsModal,
  selectedSetting,
  chooseSetting,
  handleConfirmDeleteIndex,
}: TitleBarProps) => {
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
      {selectedSetting === "editList" ? (
        <Pressable
          onPress={() => {
            chooseSetting(null);
            handleConfirmDeleteIndex(null);
          }}
        >
          <DefaultText>Done</DefaultText>
        </Pressable>
      ) : (
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          size={24}
          color={"white"}
          onPress={handleSettingsModal}
        />
      )}
    </View>
  );
};

export default TitleBar;
