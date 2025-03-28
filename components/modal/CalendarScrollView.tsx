import { colors } from "@/assets/colors/colors";
import { getCalendarDate, getCurrentDate, getScrollDates } from "@/hooks/hooks";
import { useWeatherData } from "@/hooks/useWeatherData";
import React, { memo, MutableRefObject, useEffect, useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import DefaultText from "../atoms/DefaultText";

interface CalendarScrollViewProps {
  cityName: string;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  currentIndexRef: MutableRefObject<number>;
  scrollRef: MutableRefObject<boolean>;
  handleOpenModalDropdown: (visible: boolean) => void;
  // animateFade: (onFadeOutComplete?: () => void) => void;
}

const CalendarScrollView = ({
  cityName,
  currentIndex,
  setCurrentIndex,
  currentIndexRef,
  scrollRef,
  handleOpenModalDropdown,
}: // animateFade,
CalendarScrollViewProps) => {
  const data = useWeatherData();
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
        {scrollWeekdayLetters.map((val, index) => {
          const calendarDateColor =
            index === currentIndex
              ? colors.darkGray
              : index === 0
              ? colors.blue
              : "white";

          const calendarDateBackgroundColor =
            index === currentIndex
              ? index === 0
                ? colors.blue
                : colors.lightGray
              : "transparent";

          const handleNewIndex = () => {
            if (index !== currentIndex) {
              setCurrentIndex(index);
              handleOpenModalDropdown(false);
              // why is this true?
              scrollRef.current = true;
            }
          };

          return (
            <Pressable
              key={index}
              className="gap-y-1 items-center"
              onPress={() => handleNewIndex()}
            >
              <DefaultText key={index} className="font-semibold">
                {val}
              </DefaultText>

              <View
                className="items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: calendarDateBackgroundColor,
                  borderRadius: index === currentIndex ? 20 : undefined,
                }}
              >
                <DefaultText
                  key={index}
                  className="text-2xl font-semibold"
                  style={{
                    color: calendarDateColor,
                  }}
                >
                  {scrollDates[index]}
                </DefaultText>
              </View>
            </Pressable>
          );
        })}
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

export default React.memo(CalendarScrollView);
