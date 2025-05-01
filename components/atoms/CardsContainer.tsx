import { View, Text, TextStyle, StyleProp, ViewStyle } from "react-native";
import React from "react";

interface CardsContainerProps {
  children: React.ReactNode;
  className: string;
  style?: StyleProp<ViewStyle>;
}

const CardsContainer = ({
  children,
  className,
  style,
}: CardsContainerProps) => {
  return (
    <View className={className} style={style}>
      {children}
    </View>
  );
};

export default CardsContainer;
