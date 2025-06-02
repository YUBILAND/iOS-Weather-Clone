import React from "react";
import { View } from "react-native";
import { Text, useFont } from "@shopify/react-native-skia";
import Roboto from "../../assets/fonts/Roboto-Regular.ttf";

interface YAxisTextProps {
  graphSizeY: number;
}
const YAxisText = ({ graphSizeY }: YAxisTextProps) => {
  const font = useFont(Roboto, 14);

  return ["Light", "Moderate", "Heavy"].map((text, index) => (
    <Text
      key={index}
      x={4}
      y={graphSizeY * ((3 - (index + 1)) / 3) + 20}
      font={font}
      text={text}
      color={"white"}
    />
  ));
};

export default YAxisText;
