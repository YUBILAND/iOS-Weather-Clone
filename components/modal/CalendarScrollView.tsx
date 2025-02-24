import { colors } from "@/assets/colors/colors";
import { getCalendarDate, getCurrentDate, getScrollDates } from "@/hooks/hooks";
import { RootState } from "@/state/store";
import React, { MutableRefObject, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import DefaultText from "../atoms/DefaultText";

interface CalendarScrollViewProps {
  cityName: string;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  currentIndexRef: MutableRefObject<number>;
  scrollRef: MutableRefObject<boolean>;
}

const CalendarScrollView = ({
  cityName,
  currentIndex,
  setCurrentIndex,
  currentIndexRef,
  scrollRef,
}: CalendarScrollViewProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { location } = data[cityName];

  // Change selected calendar date
  const calendarDate = useMemo(() => {
    if (location) {
      return getCalendarDate(location.tz_id, currentIndex);
    }
    return null;
  }, [currentIndex]);

  // Get scrollable weekday letters and calendar dates
  const { month, day, year, weekday } = useMemo(() => {
    return getCurrentDate(location?.tz_id);
  }, [location?.tz_id]);

  const { scrollWeekdayLetters, scrollDates } = useMemo(() => {
    return getScrollDates(3, month, day, year, weekday);
  }, [month, day, year, weekday]);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
          marginTop: 0,
          marginBottom: 12,
          paddingHorizontal: 12,
        }}
      >
        {scrollWeekdayLetters.map((val, index) => (
          <Pressable
            key={index}
            className="gap-y-1 items-center"
            onPress={() => {
              if (index !== currentIndex) {
                setCurrentIndex(index);
                // console.log("index is", index);
                // why is this true?
                scrollRef.current = true;
              }
            }}
          >
            <DefaultText key={index} className="font-semibold">
              {val}
            </DefaultText>

            <View
              className="items-center justify-center"
              style={{
                width: 40,
                height: 40,
                backgroundColor:
                  index === currentIndex
                    ? index === 0
                      ? colors.blue
                      : colors.lightGray
                    : undefined,
                borderRadius: index === currentIndex ? 20 : undefined,
              }}
            >
              <DefaultText
                key={index}
                className="text-2xl font-semibold"
                style={{
                  color:
                    index === currentIndex
                      ? colors.darkGray
                      : index === 0
                      ? colors.blue
                      : "white",
                }}
              >
                {scrollDates[index]}
              </DefaultText>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View className="items-center ">
        <DefaultText
          style={{
            fontSize: 18,
            lineHeight: 18,
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          {calendarDate}
        </DefaultText>
      </View>
    </>
  );
};

export default CalendarScrollView;
