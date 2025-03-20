import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/assets/colors/colors";
import {
  iconMap,
  IconObject,
  modalDropdownObjects,
  SelectModal,
} from "../utils/modalConstants";
import {
  AirPressureIcon,
  ConditionsIcon,
  HumidityIcon,
  PrecipitationIcon,
  UVIcon,
  VisibilityIcon,
  WindChillIcon,
  WindIcon,
} from "../utils/icons";

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
  const IconComponent = iconMap[selectedModal];

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
      <IconComponent />

      <Ionicons name="chevron-down-outline" size={22} color={"white"} />
    </Pressable>
  );
};

export default ModalDropdownButton;
