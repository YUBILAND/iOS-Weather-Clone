import { View, Text } from "react-native";
import React from "react";

interface LocationCardContainerProps {
  children: React.ReactNode;
}
const LocationCardContainer = ({ children }: LocationCardContainerProps) => {
  return <View className="gap-y-2">{children}</View>;
};

export default LocationCardContainer;
