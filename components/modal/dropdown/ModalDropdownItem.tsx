import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import DefaultText from "../../atoms/DefaultText";

import HorizontalLine from "../../atoms/HorizontalLine";
import {
  iconMap,
  ModalDropdownObject,
  modalDropdownObjects,
  SelectModal,
} from "../utils/modalConstants";

interface ModalDropdownItemProps {
  item: ModalDropdownObject;
  index: number;
  selectedModal: SelectModal;
  setSelectedModal: (modal: SelectModal) => void;
  handleIsOpen: (open: boolean) => void;
  modalName: SelectModal;
}

const ModalDropdownItem = ({
  item,
  index,
  selectedModal,
  setSelectedModal,
  handleIsOpen,
  modalName,
}: ModalDropdownItemProps) => {
  const lastIndex = index === Object.keys(modalDropdownObjects).length - 1;

  const pressDropdownItem = () => {
    setSelectedModal(modalName);
    handleIsOpen(false);
  };

  const IconComponent = iconMap[modalName];

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
        <View className="flex-[0.3]">
          <View className="items-center">
            <IconComponent />
          </View>
        </View>
      </View>

      {!lastIndex && <HorizontalLine />}
    </Pressable>
  );
};

export default ModalDropdownItem;
