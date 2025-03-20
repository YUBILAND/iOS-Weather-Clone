import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import HrAndMinSmaller from "../atoms/HrAndMinSmaller";
import { removeZeroFromTimeString } from "@/hooks/hooks";

interface SunPhaseInfoProps {
  sunPhaseInfo: {
    Dawn: string;
    "Today's Sunrise": string;
    "Today's Sunset": string;
    Dusk: string;
    Sunlight: string;
  };
}

const SunPhaseInfo = ({ sunPhaseInfo }: SunPhaseInfoProps) => {
  return (
    <>
      {Object.entries(sunPhaseInfo).map(([key, val], index) => {
        return (
          <React.Fragment key={key}>
            <View className="flex-row justify-between items-center">
              <DefaultText className="px-4 py-2 text-lg font-semibold">
                {key}
              </DefaultText>
              <DefaultText
                className="px-4 py-2 text-lg font-semibold"
                style={{ color: colors.bgWhite(0.6) }}
              >
                {key === "Sunlight" ? (
                  <HrAndMinSmaller
                    hour={val.split("HR")[0]}
                    minute={removeZeroFromTimeString(
                      val.split(" ")[1].split("MIN")[0]
                    )}
                    fontSize={12}
                  />
                ) : (
                  val
                )}
              </DefaultText>
            </View>

            {index != Object.keys(sunPhaseInfo).length - 1 && (
              <Text
                className="w-full"
                style={{
                  height: 0,
                  borderWidth: 1,
                  borderColor: colors.lightGray,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default SunPhaseInfo;
