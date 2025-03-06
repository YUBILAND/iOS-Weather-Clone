import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/assets/colors/colors";
import { modalDropdownObjects, SelectModal } from "../utils/modalConstants";

interface ModalDropdownButtonProps {
  openModalDropdown: boolean;
  setOpenModalDropdown: (visible: boolean) => void;
  isAnyActive: boolean;
  selectedModal: SelectModal;
}

const ModalDropdownButton = ({
  openModalDropdown,
  setOpenModalDropdown,
  isAnyActive,
  selectedModal,
}: ModalDropdownButtonProps) => {
  return (
    <Pressable
      onPress={() => setOpenModalDropdown(!openModalDropdown)}
      style={{
        backgroundColor: colors.mediumGray,
        width: 80,
        opacity: openModalDropdown ? 0.5 : isAnyActive ? 0 : 1,
      }}
      className="flex-row items-center px-4 py-2 rounded-full gap-x-2 "
    >
      <Ionicons
        name={modalDropdownObjects[selectedModal].imageName}
        size={22}
        color={"white"}
      />

      <Ionicons name="chevron-down-outline" size={22} color={"white"} />
    </Pressable>
  );
};

export default ModalDropdownButton;
