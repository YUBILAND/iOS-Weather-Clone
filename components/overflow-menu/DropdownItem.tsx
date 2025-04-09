import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import RightSideIcon from "./RightSideIcon";
import { CheckIcon } from "react-native-heroicons/outline";
import { modalDropdownObjects } from "../modal/utils/modalConstants";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { OtherUnitsType } from "@/state/settings/constants";

interface DropdownItemProps {
  name: string;
  label: string;
  showCheckIcon?: boolean;
  rightSideIcon?: React.ElementType;
  handlePress: (unitName: string) => void;
  itemName: string;
}

const DropdownItem = ({
  name,
  label,
  showCheckIcon = false,
  rightSideIcon,
  handlePress,
  itemName,
}: DropdownItemProps) => {
  //   const pressDropdownItem = () => {
  //     setSelectedModal(modalName);
  //     handleIsOpen(false);
  //   };

  const IconComponent = rightSideIcon!;

  return (
    // <Pressable
    //   onPress={handlePress}
    //   className="flex-row px-4 gap-2 items-center pr-8 w-full"
    // >

    <Pressable
      onPress={() => handlePress(name)}
      className="flex-row items-center px-4"
    >
      {/* Left Side Icon */}
      <View style={{ opacity: showCheckIcon ? 1 : 0 }}>
        {/* <Ionicons name="checkmark-outline" size={18} color={"white"} /> */}

        <CheckIcon color={"white"} />
      </View>

      {/* Text */}
      <View>
        <DefaultText className=" text-lg font-semibold text-white px-2">
          {label}
        </DefaultText>
      </View>

      {/* Right Side Icon */}
      <View className="items-center" style={{ opacity: rightSideIcon ? 1 : 0 }}>
        {rightSideIcon ? <IconComponent /> : <CheckIcon />}
      </View>
    </Pressable>
  );
};

export default DropdownItem;
