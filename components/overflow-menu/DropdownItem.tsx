import React from "react";
import { Pressable, View } from "react-native";
import { CheckIcon } from "react-native-heroicons/outline";
import DefaultText from "../atoms/DefaultText";

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
  const IconComponent = rightSideIcon!;

  return (
    <Pressable
      onPress={() => handlePress(name)}
      className="flex-row items-center px-4"
    >
      {/* Left Side Icon */}
      <View style={{ opacity: showCheckIcon ? 1 : 0 }}>
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
