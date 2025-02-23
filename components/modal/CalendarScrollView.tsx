import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { days } from "@/utils/exampleForecast";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getCalendarDate, getCurrentDate } from "@/hooks/hooks";

const CalendarScrollView = ({ cityName }: { cityName: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const { location, forecast, current } = data[cityName];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [calendarDate, setCalendarDate] = useState("");

  useEffect(() => {
    if (location) {
      const newConditionDate = getCalendarDate(location?.tz_id, currentIndex);
      setCalendarDate(newConditionDate);
    }
  }, [currentIndex]);

  // Get number of day in month according ot year
  const d = (y: number, m: number) => new Date(y, m, 0).getDate();

  const { month, day, year, weekday } = getCurrentDate(location?.tz_id);
  // console.log("date is", month, "/", day, "/", year);
  // console.log(d(year, month));
  // console.log(weekday);

  const currentWeekdayIndex = days.indexOf(weekday);

  const getScrollDates = (numberOfDays: number) => {
    const xCountArray = [...Array(numberOfDays).keys()];

    const scrollWeekdayLetters = xCountArray.map((val) => {
      return days[(currentWeekdayIndex + val) % (days.length - 1)][0];
    });

    const scrollDates = xCountArray.map((val) => {
      return (day + val) % (d(year, month) + 1);
    });
    return { scrollWeekdayLetters, scrollDates };
  };

  const { scrollWeekdayLetters, scrollDates } = getScrollDates(10);
  //   if (location) {
  //     const now = new Date();

  //     const weekday = now.toLocaleString("en-US", {
  //       timeZone: location?.tz_id,
  //       weekday: "long",
  //     });
  //     const tzs = new Intl.DateTimeFormat("en-US", {
  //       timeZone: location?.tz_id,
  //       weekday: "long",
  //       month: "long",
  //       day: "numeric",
  //       year: "numeric",
  //     });
  //     const tmz = tzs.format(now);
  //     // console.log(tmz);
  //     setCalendarDate(tmz);
  //   }
  // }, []);

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
            onPress={() => setCurrentIndex(index)}
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
