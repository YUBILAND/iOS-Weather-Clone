import { View, Text, Pressable } from "react-native";
import React, { PropsWithChildren } from "react";
import { colors } from "@/assets/colors/colors";
import { BlurView } from "expo-blur";

const OpacityCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className="rounded-xl overflow-hidden">
      <BlurView className={`py-4 ${className}`} intensity={60} tint="dark">
        {children}
      </BlurView>
    </View>
  );
};

export default OpacityCard;
