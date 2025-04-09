import { View, Text } from "react-native";
import React from "react";

interface RightSideIconProps {
  icon: React.ElementType;
}
const RightSideIcon = ({ icon }: RightSideIconProps) => {
  const IconComponent = icon;
  return (
    <View className="flex-[0.3]">
      <View className="items-center">
        <IconComponent />
      </View>
    </View>
  );
};

export default RightSideIcon;
