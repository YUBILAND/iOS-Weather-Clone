import { colors } from "@/assets/colors/colors";
import React, { memo } from "react";
import { View } from "react-native";

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
    <>
      <View
        className="h-8 mb-12 relative "
        style={{
          width: 10,
          borderWidth: 2,
          borderLeftColor: "white",
        }}
      />

      {Array(11)
        .fill(0)
        .map((val, idx) => {
          return (
            <View
              key={idx}
              className="h-8 mb-12 relative "
              style={{
                width: 10,
                borderWidth: 2,
                borderLeftColor: colors.mediumGray,
              }}
            ></View>
          );
        })}
      {item.id === arrLength - 1 && (
        <View
          className="h-8 mb-12 relative "
          style={{
            width: 10,
            borderWidth: 2,
            borderLeftColor: "white",
          }}
        />
      )}
    </>
  );
};

export default memo(MoonTimeSticks);
