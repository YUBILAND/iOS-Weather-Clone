import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import DefaultText from "../../atoms/DefaultText";
import {
  ModalDropdownObject,
  modalDropdownObjects,
  SelectModal,
} from "../utils/modalConstants";
import HorizontalLine from "../../atoms/HorizontalLine";

interface ModalDropdownItemProps {
  item: ModalDropdownObject;
  index: number;
  selectedModal: SelectModal;
  setSelectedModal: (modal: SelectModal) => void;
  setOpenModalDropdown: (open: boolean) => void;
  modalName: SelectModal;
}

const ModalDropdownItem = ({
  item,
  index,
  selectedModal,
  setSelectedModal,
  setOpenModalDropdown,
  modalName,
}: ModalDropdownItemProps) => {
  const lastIndex = index === Object.keys(modalDropdownObjects).length - 1;

  const pressDropdownItem = () => {
    setSelectedModal(modalName);
    setOpenModalDropdown(false);
  };

  return (
    <Pressable onPress={pressDropdownItem}>
      <View className="flex-row items-center " style={{ paddingVertical: 8 }}>
        <View
          className="flex-[0.1] pl-4"
          style={{ opacity: selectedModal === modalName ? 1 : 0 }}
        >
          <Ionicons name="checkmark-outline" size={18} color={"white"} />
        </View>
        <DefaultText className=" flex-[0.7] text-lg font-semibold text-white px-2">
          {item.label}
        </DefaultText>
        <View className="flex-[0.2]">
          <Ionicons name={item.imageName} size={18} color={"white"} />
        </View>
      </View>

      {!lastIndex && <HorizontalLine />}
    </Pressable>
  );
};

export default ModalDropdownItem;
