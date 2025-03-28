import { View, Text, TextProps, TextStyle, StyleProp } from "react-native";
import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type DefaultTextProps = TextProps & {
  style?: StyleProp<TextStyle>; // Optional style prop for custom styles
  className?: string;
};

const DefaultText = ({
  style,
  className,
  children,
}: PropsWithChildren<DefaultTextProps>) => (
  <Text
    style={[{ color: "white", fontWeight: 500 }, style]}
    className={className}
  >
    {children}
  </Text>
);

export default DefaultText;
