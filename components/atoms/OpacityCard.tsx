import { View, Text, Pressable } from "react-native";
import React, { PropsWithChildren } from "react";
import { colors } from "@/assets/colors/colors";

const OpacityCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View
      className={`rounded-xl py-4 ${className}`}
      style={{ backgroundColor: colors.bgWhite(0.15) }}
    >
      {children}
    </View>
  );
};

export default OpacityCard;
