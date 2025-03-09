const beaufortScaleArray = [
  {
    bftIndex: 0,
    color: "#00B2E2",
    explanation: "Calm",
    speed: "< 1",
  },
  {
    bftIndex: 1,
    color: "#00C6A7",
    explanation: "Light Air",
    speed: "1 - 2",
  },
  {
    bftIndex: 2,
    color: "#00D36F",
    explanation: "Light Breeze",
    speed: "3 - 6",
  },
  {
    bftIndex: 3,
    color: "#5DD700",
    explanation: "Gentle Breeze",
    speed: "7 - 11",
  },
  {
    bftIndex: 4,
    color: "#A8D700",
    explanation: "Moderate Breeze",
    speed: "12 - 17",
  },
  {
    bftIndex: 5,
    color: "#D1C800",
    explanation: "Fresh Breeze",
    speed: "18-23",
  },
  {
    bftIndex: 6,
    color: "#E3A100",
    explanation: "Strong Breeze",
    speed: "24 - 30",
  },
  {
    bftIndex: 7,
    color: "#E68A00",
    explanation: "Near Gale",
    speed: "31 - 38",
  },
  {
    bftIndex: 8,
    color: "#E67600",
    explanation: "Gale",
    speed: "39 - 45",
  },
  {
    bftIndex: 9,
    color: "#E66000",
    explanation: "Strong Gale",
    speed: "46 - 54",
  },
  {
    bftIndex: 10,
    color: "#E64500",
    explanation: "Storm",
    speed: "55 - 63",
  },
  {
    bftIndex: 11,
    color: "#D80019",
    explanation: "Violent Storm",
    speed: "64 - 72",
  },
  {
    bftIndex: 12,
    color: "#E40059",
    explanation: "Hurricane",
    speed: "> 73",
  },
];

import { View, Text } from "react-native";
import React from "react";
import Dot from "../modal/Dot";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import HorizontalLine from "../atoms/HorizontalLine";

const BeaufortScale = () => {
  return (
    <>
      <View className="flex-row " style={{ paddingHorizontal: 16 }}>
        <View style={{ flex: 0.2 }}>
          <DefaultText className="font-semibold">bft</DefaultText>
        </View>
        <View style={{ flex: 0.6 }}>
          <DefaultText className="font-semibold">Explanation</DefaultText>
        </View>
        <View style={{ flex: 0.2 }}>
          <DefaultText className="font-semibold">mph</DefaultText>
        </View>
      </View>

      <HorizontalLine />
      {beaufortScaleArray.map((item) => (
        <React.Fragment key={item.bftIndex}>
          <View
            className="flex-row "
            style={{
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{ flex: 0.2 }}
              className="flex-row items-center gap-x-2"
            >
              <Dot color={item.color} size={14} />
              <DefaultText className="font-semibold" style={{ fontSize: 16 }}>
                {item.bftIndex}
              </DefaultText>
            </View>
            <View style={{ flex: 0.6 }}>
              <DefaultText
                className="font-semibold"
                style={{ color: colors.lightGray, fontSize: 16 }}
              >
                {item.explanation}
              </DefaultText>
            </View>
            <View style={{ flex: 0.2 }}>
              <DefaultText
                className="font-semibold"
                style={{ color: colors.lightGray, fontSize: 16 }}
              >
                {item.speed}
              </DefaultText>
            </View>
          </View>

          {item.bftIndex !== beaufortScaleArray.length - 1 && (
            <HorizontalLine />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default BeaufortScale;
