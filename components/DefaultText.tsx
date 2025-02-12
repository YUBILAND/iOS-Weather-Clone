import { View, Text, TextProps, TextStyle } from "react-native";
import React, { PropsWithChildren } from "react";

type DefaultTextProps = TextProps & {
  style?: TextStyle; // Optional style prop for custom styles
  className?: string;
};

const DefaultText = ({
  style,
  className,
  children,
}: PropsWithChildren<DefaultTextProps>) => (
  <Text style={[{ color: "white" }, style]} className={className}>
    {children}
  </Text>
);

export default DefaultText;
