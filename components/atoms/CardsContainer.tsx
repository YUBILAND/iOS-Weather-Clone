import { View, Text } from "react-native";
import React from "react";

interface CardsContainerProps {
  children: React.ReactNode;
  className: string;
}

const CardsContainer = ({ children, className }: CardsContainerProps) => {
  return <View className={className}>{children}</View>;
};

export default CardsContainer;
