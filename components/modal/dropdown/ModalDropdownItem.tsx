import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import DefaultText from "../../atoms/DefaultText";
import {
  modalDropdownObjects,
  modalDropdownObjectsType,
} from "../utils/constants";
import HorizontalLine from "../../atoms/HorizontalLine";

interface ModalDropdownItemProps {
  item: modalDropdownObjectsType;
  selectedModal: number;
  setSelectedModal: (index: number) => void;
  index: number;
  setOpenModalDropdown: (visible: boolean) => void;
}

const ModalDropdownItem = ({
  item,
  selectedModal,
  setSelectedModal,
  index,
  setOpenModalDropdown,
}: ModalDropdownItemProps) => {
  const lastIndex = index === modalDropdownObjects.length - 1;

  const pressDropdownItem = () => {
    setSelectedModal(item.id ?? 0);
    setOpenModalDropdown(false);
  };

  return (
    <Pressable onPress={pressDropdownItem}>
      <View className="flex-row items-center " style={{ paddingVertical: 8 }}>
        <View
          className="flex-[0.1] pl-4"
          style={{ opacity: selectedModal === item.id ? 1 : 0 }}
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
