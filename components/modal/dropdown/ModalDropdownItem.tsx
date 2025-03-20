import { View, Text, Pressable } from "react-native";
import React from "react";
import DefaultText from "../../atoms/DefaultText";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import {
  iconMap,
  IconObject,
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
          {/* // @ts.ignore, icon name union doesn't seem to be working */}

          {/* <IconComponent
            name={iconMap[modalName].name}
            size={iconMap[modalName].size}
            color={iconMap[modalName].color}
          /> */}
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
