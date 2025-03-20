import { View, Text } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";
import { removeZeroFromTimeString } from "@/hooks/hooks";
import { colors } from "@/assets/colors/colors";

interface HrAndMinSmaller {
  hour: string;
  minute: string;
  fontSize?: number;
}

const HrAndMinSmaller = ({ hour, minute, fontSize = 11 }: HrAndMinSmaller) => {
  return (
    <>
      {hour}
      <DefaultText style={{ fontSize: fontSize, color: colors.lightGray }}>
        HR
      </DefaultText>{" "}
      {removeZeroFromTimeString(minute)}
      <DefaultText style={{ fontSize: fontSize, color: colors.lightGray }}>
        MIN
      </DefaultText>
    </>
  );
};

export default HrAndMinSmaller;
