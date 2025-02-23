import { View, Text, Image } from "react-native";
import React from "react";

const Sunrise = ({
  sunrise,
  className,
}: {
  sunrise?: string;
  className: string;
}) => {
  return (
    <View className="flex-row gap-x-2 items-center">
      <Image source={require("../assets/icons/sun.png")} className="h-6 w-6" />
      <Text className={className}>{sunrise}</Text>
    </View>
  );
};

export default Sunrise;
