import { View, Text } from "react-native";
import React from "react";
import Dot from "../modal/Dot";
import DefaultText from "../atoms/DefaultText";
import { DotTableEntry } from "./PrecipitationDotTable";
import DotText from "./DotText";

interface EntryValueProps {
  entry: DotTableEntry;
}

const EntryValue = ({ entry }: EntryValueProps) => {
  return (
    <View className="flex-row justify-between">
      <DotText dotColor={entry?.dot} text={entry?.variable} />

      <DefaultText
        className="font-semibold text-lg"
        style={{ color: entry?.dot ? entry?.dot : "white" }}
      >
        {entry.value}
      </DefaultText>
    </View>
  );
};

export default EntryValue;
