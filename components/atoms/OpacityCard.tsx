import { View, Text, Pressable, StyleProp, ViewStyle } from "react-native";
import React, { PropsWithChildren } from "react";
import { colors } from "@/assets/colors/colors";
import { BlurView } from "expo-blur";
import Animated, { AnimatedStyle } from "react-native-reanimated";

const OpacityCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Animated.View
      className=" overflow-hidden rounded-xl"
      // style={{ borderRadius: 20 }}
    >
      <BlurView
        className={`rounded-xl py-4 ${className}`}
        intensity={60}
        tint="dark"
      >
        {children}
      </BlurView>
    </Animated.View>
  );
};

export default OpacityCard;
