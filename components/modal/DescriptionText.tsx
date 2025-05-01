import { View, Text, TextProps, StyleProp, TextStyle } from "react-native";
import React, { PropsWithChildren } from "react";
import DefaultText from "../atoms/DefaultText";

type DescriptionTextProps = TextProps & {
  style?: StyleProp<TextStyle>; // Optional style prop for custom styles
  className?: string;
};
const DescriptionText = ({
  style,
  className,
  children,
}: PropsWithChildren<DescriptionTextProps>) => {
  return (
    <DefaultText
      style={[{ fontSize: 17, lineHeight: 21, fontWeight: 400 }, style]}
    >
      {children}
    </DefaultText>
  );
};

export default DescriptionText;
