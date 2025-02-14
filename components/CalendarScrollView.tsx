import { View, Text, ScrollView } from "react-native";
import React from "react";
import { days } from "@/utils/exampleForecast";
import DefaultText from "./DefaultText";
import { colors } from "@/assets/colors/colors";

const CalendarScrollView = () => {
  const exampleArray = [...Array(15).keys()];

  const daysLetter = days.map((day) => day[0]);

  const currentIndex = 0;
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 21,
          marginTop: 20,
          marginBottom: 16,

          paddingHorizontal: 24,
        }}
      >
        {exampleArray.map((val, index) => (
          <View className="gap-y-4 items-center">
            <DefaultText key={index} className="font-semibold">
              {daysLetter[index % (daysLetter.length - 1)]}
            </DefaultText>

            <View
              className="items-center justify-center"
              style={{
                width: 40,
                height: 40,
                backgroundColor:
                  index === currentIndex ? colors.lightGray : undefined,
                borderRadius: index === currentIndex ? 20 : undefined,
              }}
            >
              <DefaultText
                key={index}
                className="text-2xl font-semibold"
                style={{
                  color: index === currentIndex ? colors.darkGray : "white",
                }}
              >
                {val}
              </DefaultText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="items-center ">
        <DefaultText style={{ fontSize: 20, lineHeight: 20, marginBottom: 15 }}>
          Saturday, August 12, 2023
        </DefaultText>
      </View>
    </>
  );
};

export default CalendarScrollView;
