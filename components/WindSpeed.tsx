import { View, Text, Image } from "react-native";
import React from "react";

const WindSpeed = ({
  windSpeed,
  className,
}: {
  windSpeed?: string;
  className: string;
}) => {
  return (
    <View className={className}>
      <Image source={require("../assets/icons/wind.png")} className="h-6 w-6" />
      <Text className="text-white font-semibold">{windSpeed}km</Text>
    </View>
  );
};

export default WindSpeed;
