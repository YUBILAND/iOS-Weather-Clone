import { colors } from "@/assets/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import { iconMap, SelectModal } from "../utils/modalConstants";

interface ModalDropdownButtonProps {
  openModalDropdown: boolean;
  setOpenModalDropdown: (visible: boolean) => void;
  selectedModal: SelectModal;
}

const ModalDropdownButton = ({
  openModalDropdown,
  setOpenModalDropdown,
  selectedModal,
}: ModalDropdownButtonProps) => {
  const IconComponent = iconMap[selectedModal];

  return (
    <Pressable
      onPress={() => setOpenModalDropdown(!openModalDropdown)}
      style={{
        backgroundColor: colors.mediumGray,
        width: 80,
      }}
      className="flex-row items-center px-4 py-2 rounded-full gap-x-2 "
    >
      {IconComponent && <IconComponent />}

      <Ionicons name="chevron-down-outline" size={22} color={"white"} />
    </Pressable>
  );
};

export default ModalDropdownButton;
