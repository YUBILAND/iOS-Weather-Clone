import { colors } from "@/assets/colors/colors";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import Dot from "../modal/Dot";

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
            {entry?.header && (
              <DefaultText
                style={{ color: colors.lightGray, fontSize: 10 }}
                className="uppercase"
              >
                {entry.header}
              </DefaultText>
            )}
            {entry.variable && entry.value && (
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-x-2">
                  {entry?.dot ? <Dot color={entry?.dot} /> : null}
                  <DefaultText className="font-semibold text-lg">
                    {entry.variable}
                  </DefaultText>
                </View>

                <DefaultText
                  className="font-semibold text-lg"
                  style={{ color: entry?.dot ? entry?.dot : "white" }}
                >
                  {entry.value}
                </DefaultText>
              </View>
            )}
          </View>
        </React.Fragment>
      ))}
    </>
  );
};

export default PrecipitationDotTable;
