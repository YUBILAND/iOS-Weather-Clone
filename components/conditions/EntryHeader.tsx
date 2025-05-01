import { View, Text } from "react-native";
import React from "react";
import { DotTableEntry } from "./PrecipitationDotTable";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";

interface EntryHeaderProps {
  entry: DotTableEntry;
}
const EntryHeader = ({ entry }: EntryHeaderProps) => {
  return (
    <DefaultText
      style={{ color: colors.lightGray, fontSize: 10 }}
      className="uppercase"
    >
      {entry.header}
    </DefaultText>
  );
};

export default EntryHeader;
