import { View, Text } from "react-native";
import React, { memo } from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import { weekday } from "@/constants/constants";
import { getShortWeekday } from "../daily-forecast/utils/getShortWeekday";

const MoonTimeSticks = ({
  item,
  arrLength,
  daysSincePrevMonth,
}: {
  item: { id: number; weekday: string };
  arrLength: number;
  daysSincePrevMonth: number;
}) => {
  return (
    <View
      className="h-8 mb-12 relative "
      style={{
        width: item.id === arrLength - 1 ? 0 : 10,
        borderWidth: 2,
        borderLeftColor: item.id % 12 === 0 ? "white" : colors.mediumGray,
      }}
    >
      {/* {item.id % 12 === 0 && item.id < arrLength - 1 && (
        <View className="absolute bottom-[-30px] left-12">
          <DefaultText>{item.weekday}</DefaultText>
        </View>
      )} */}

      {item.id % 12 === 0 && Math.floor(item.id / 12) === daysSincePrevMonth ? (
        <View className="absolute bottom-[-30px] left-12 w-20">
          <DefaultText className="font-semibold">Today</DefaultText>
        </View>
      ) : item.id % 12 === 0 && item.id < arrLength - 1 ? (
        <View className="absolute bottom-[-30px] left-12 w-20">
          <DefaultText className="">{item.weekday}</DefaultText>
        </View>
      ) : (
        <View className="absolute" />
      )}
    </View>
  );
};

export default memo(MoonTimeSticks);
