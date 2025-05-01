import React from "react";
import { View } from "react-native";
import HorizontalLine from "../atoms/HorizontalLine";
import EntryHeader from "./EntryHeader";
import EntryValue from "./EntryValue";

export interface DotTableEntry {
  header?: string;
  variable?: string;
  value?: string;
  dot?: string;
}

interface PrecipitationDotTableProps {
  entryArr: DotTableEntry[];
}

const PrecipitationDotTable = ({ entryArr }: PrecipitationDotTableProps) => {
  return (
    <>
      {entryArr.map((entry, idx) => (
        <React.Fragment key={idx}>
          {idx !== 0 ? <HorizontalLine /> : null}

          <View className="gap-y-0">
            {entry?.header && <EntryHeader entry={entry} />}

            {entry.variable && entry.value && <EntryValue entry={entry} />}
          </View>
        </React.Fragment>
      ))}
    </>
  );
};

export default PrecipitationDotTable;
