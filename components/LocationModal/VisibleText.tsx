import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";

interface VisibleTextProps {
  text: string;
  visible: boolean;
  exists: boolean;
  fontSize: number;
}

const VisibleText = ({ text, visible, exists, fontSize }: VisibleTextProps) => {
  return (
    <View
      style={{
        opacity: visible ? 0 : 1,
        display: exists ? "flex" : "none",
        zIndex: 0,
      }}
    >
      <DefaultText style={{ fontSize: fontSize, fontWeight: 700 }}>
        {text}
      </DefaultText>
    </View>
  );
};

export default VisibleText;
