import { View, Text, Image } from "react-native";
import React from "react";

const Humidity = ({
  humidity,
  className,
}: {
  humidity?: string;
  className: string;
}) => {
  return (
    <View className="flex-row gap-x-2 items-center">
      <Image source={require("../assets/icons/drop.png")} className="h-6 w-6" />
      <Text className={className}>{humidity}%</Text>
    </View>
  );
};

export default Humidity;
