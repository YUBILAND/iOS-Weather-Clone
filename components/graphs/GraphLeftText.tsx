import { View, Text, Image } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import {
  Current,
  GraphKeyType,
  WeatherData,
  weatherKey,
} from "@/constants/constants";
import { colors } from "@/assets/colors/colors";
import { getDayArr } from "../precipitation/utils/getDayArr";

interface GraphLeftTextProps {
  id: number;
  currentTopText: string;
  otherTopText: string;
  currentBottomText: string;
  otherBottomText: string;
}

const GraphLeftText = ({
  id,
  currentTopText,
  otherTopText,
  currentBottomText,
  otherBottomText,
}: GraphLeftTextProps) => {
  return (
    <View className="flex-row justify-between items-center">
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          {/* <DefaultText className="text-4xl">
            {id === 0
              ? Math.round(currentData) + unit
              : Math.round(dailyMin) + " to"}
          </DefaultText>

          {id !== 0 && (
            <DefaultText className="text-4xl">
              {Math.round(dailyMax) + unit}
            </DefaultText>
          )} */}

          {id === 0 ? (
            <DefaultText className="text-4xl">{currentTopText}</DefaultText>
          ) : (
            <DefaultText className="text-4xl">{otherTopText}</DefaultText>
          )}
        </View>
        {id === 0 ? (
          <DefaultText style={{ color: colors.lightGray }}>
            {currentBottomText}
          </DefaultText>
        ) : (
          <DefaultText style={{ color: colors.lightGray }}>
            {otherBottomText}
          </DefaultText>
        )}
      </View>
    </View>
  );
};

export default GraphLeftText;
