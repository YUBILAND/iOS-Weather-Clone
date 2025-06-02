import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { runOnUI, SharedValue } from "react-native-reanimated";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import { TICKS_PER_DAY } from "./utils/constants";
import { getDaysSincePrevMonth } from "./utils/getDaysSincePrevMonth";
import { getTimeUntilNextFullMoonDate } from "./utils/getNextFullMoonDate";
import { getTicksAmount } from "./utils/getTicksAmount";
import { getCurrentDate, getDaysOfMonth } from "@/hooks/hooks";

interface MoonPhaseCalendarProps {
  data: WeatherData;
  userScrolledIndex: number;
  flatlistRef: RefObject<FlatList>;
  setUserScrolledIndex: (index: number) => void;
  flatlistPosition: SharedValue<number>;
}

const MoonPhaseCalendar = ({
  data,
  userScrolledIndex,
  flatlistRef,
  setUserScrolledIndex,
  flatlistPosition,
}: MoonPhaseCalendarProps) => {
  const currentCalendarDate = new Date().toLocaleDateString("en-CA", {
    timeZone: data.location.tz_id,
  });

  const timeUntilNextFullMoonDate = Math.ceil(
    getTimeUntilNextFullMoonDate(data)
  );

  const fullMoonDateObject = new Date(
    new Date().setDate(new Date().getDate() + timeUntilNextFullMoonDate)
  );

  const fullMoonDateString = fullMoonDateObject.toLocaleDateString("en-US", {
    timeZone: data.location.tz_id,
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });

  const fullMoonWeekday = fullMoonDateString.split(",")[0];
  const fullMoonDate = fullMoonDateString.split(",")[1].split(" ")[1];

  const moonPeriod = 29.53;

  const fullMoonDataObjectCopy = fullMoonDateObject;
  const newMoonDateObject = new Date(
    fullMoonDataObjectCopy.setDate(
      fullMoonDateObject.getDate() + moonPeriod / 2
    )
  );
  const newMoonDateString = newMoonDateObject.toLocaleDateString("en-US", {
    timeZone: data.location.tz_id,
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });

  const newMoonWeekday = newMoonDateString.split(",")[0];
  const newMoonDate = newMoonDateString.split(",")[1].split(" ")[1];

  const moonData = [
    { title: "Full Moon", value: fullMoonDate + ` (${fullMoonWeekday})` },
    { title: "New Moon", value: newMoonDate + ` (${newMoonWeekday})` },
  ];

  const calendarTheme = {
    todayTextColor: "white",
    backgroundColor: colors.mediumGray,
    calendarBackground: colors.mediumGray,
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: "#00adf5",
    selectedDayTextColor: "#ffffff",
    dayTextColor: "white",
    dotColor: "#00adf5",
    selectedDotColor: "#ffffff",
    arrowColor: colors.lightGray,
    disabledArrowColor: colors.bgBlack(0),
    monthTextColor: "white",
    indicatorColor: "blue",
    textDayFontFamily: "monospace",
    textMonthFontFamily: "monospace",
    textDayHeaderFontFamily: "monospace",
    textDayFontWeight: "600",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
  };

  const { whiteTicks } = getTicksAmount();

  const scrolledToDate = Math.min(
    Math.max(userScrolledIndex + 1, 1),
    whiteTicks
  );

  const { currentMonthIndex } = getCurrentDate(data.location.tz_id);

  const previousMonthDays = getDaysOfMonth(2025, currentMonthIndex);
  const currentMonthDays = getDaysOfMonth(2025, currentMonthIndex + 1);
  // const nextMonthDays = getDaysOfMonth(2025, currentMonthIndex + 2);
  function modFromOne(n: number, max: number): number {
    return ((n - 1) % max) + 1;
  }
  const getScrolled = () => {
    const scrolledMonth =
      scrolledToDate <= previousMonthDays
        ? modFromOne(currentMonthIndex - 1, 12)
        : scrolledToDate <= previousMonthDays + currentMonthDays
        ? currentMonthIndex
        : modFromOne(currentMonthIndex + 1, 12);

    const scrolledDay =
      scrolledToDate <= previousMonthDays
        ? scrolledToDate
        : scrolledToDate <= previousMonthDays + currentMonthDays
        ? scrolledToDate - previousMonthDays
        : scrolledToDate - (previousMonthDays + currentMonthDays);

    return { scrolledMonth, scrolledDay };
  };

  const { scrolledMonth, scrolledDay } = getScrolled();

  const scrollToThis = new Date(
    2025,
    scrolledMonth,
    scrolledDay
  ).toLocaleDateString("en-CA", {
    timeZone: data.location.tz_id,
  });

  const selectedRef = useRef(currentCalendarDate);
  selectedRef.current = scrollToThis;

  const handleDayPress = (day: { dateString: string; timestamp: number }) => {
    const daysSincePrevMonthOfSelected = getDaysSincePrevMonth(
      new Date(day.timestamp)
    );
    setUserScrolledIndex(daysSincePrevMonthOfSelected);
    runOnUI(
      () => (flatlistPosition.value = daysSincePrevMonthOfSelected * 120)
    )();
    flatlistRef.current?.scrollToIndex({
      index: daysSincePrevMonthOfSelected * TICKS_PER_DAY,
      animated: false,
    });
  };

  type CalendarArrow = "left" | "right" | "none";
  const selectedMonth = parseInt(selectedRef.current.split("-")[1]);
  const accountForZeroIndex = 1;
  const prevMonth = new Date().getUTCMonth() + accountForZeroIndex - 1;
  const nextMonth = new Date().getUTCMonth() + accountForZeroIndex + 1;

  const [disabledArrow, setDisabledArrow] = useState<CalendarArrow>("none");

  useEffect(() => {
    selectedMonth === prevMonth
      ? setDisabledArrow("left")
      : selectedMonth === nextMonth
      ? setDisabledArrow("right")
      : setDisabledArrow("none");
  }, [selectedMonth]);

  const handleMonthChange = (day: { month: number }) => {
    day.month === prevMonth
      ? setDisabledArrow("left")
      : day.month === nextMonth
      ? setDisabledArrow("right")
      : setDisabledArrow("none");
  };

  return (
    <>
      <View className="px-4">
        <DefaultText
          className="uppercase font-semibold text-2xl pb-2 pl-2"
          style={{ letterSpacing: 2 }}
        >
          Calendar
        </DefaultText>

        <Calendar
          disableArrowLeft={disabledArrow === "left"}
          disableArrowRight={disabledArrow === "right"}
          key={selectedRef.current.toString()}
          current={selectedRef.current}
          hideExtraDays
          style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
          theme={calendarTheme}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          markingType={"custom"}
          markedDates={{
            [selectedRef.current]: {
              selected: true,
              disableTouchEvent: true,
              customStyles: {
                container: {
                  borderRadius: 10,
                  backgroundColor:
                    selectedRef.current === currentCalendarDate
                      ? colors.bgBlue(0.6)
                      : colors.bgWhite(0.4),
                  // content: require("../../assets/images/windy.png"),
                  content: "Hello",
                  color: "white",
                },
                text: {
                  color:
                    selectedRef.current === currentCalendarDate
                      ? colors.bgBlue(1)
                      : "white",
                  fontWeight: "bold",
                },
              },
            },

            [currentCalendarDate]: {
              customStyles: {
                container: {
                  borderRadius: 10,
                  backgroundColor:
                    selectedRef.current === currentCalendarDate
                      ? colors.bgBlue(0.6)
                      : "transparent",

                  // content: require("../../assets/images/windy.png"),
                  content: "Hello",
                  color: "white",
                },

                text: {
                  color: colors.bgBlue(1),
                },
              },
            },
          }}
        />
        <HorizontalLine />
        <View
          style={{
            backgroundColor: colors.mediumGray,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          {moonData.map((item, ind) => (
            <React.Fragment key={ind}>
              <View className="flex-row justify-between py-4 px-4">
                <DefaultText
                  className="font-semibold "
                  style={{ fontSize: 16 }}
                >
                  {item.title}
                </DefaultText>

                <DefaultText style={{ color: colors.lightGray, fontSize: 16 }}>
                  {item.value}
                </DefaultText>
              </View>
              {ind < moonData.length - 1 && <HorizontalLine />}
            </React.Fragment>
          ))}
        </View>
      </View>
    </>
  );
};

export default MoonPhaseCalendar;
