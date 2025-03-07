import { View, Text, Pressable, Image, FlatList } from "react-native";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import React, {
  memo,
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Calendar,
  CalendarList,
  CalendarProvider,
  LocaleConfig,
} from "react-native-calendars";
import { WeatherData } from "@/constants/constants";
import { SharedValue } from "react-native-reanimated";
import HorizontalLine from "../atoms/HorizontalLine";
import { FontWeight } from "@shopify/react-native-skia";
import { getTimeUntilNextFullMoonDate } from "./utils/getNextFullMoonDate";
import { timeToDays } from "./utils/timeToDays";
import { getDaysSincePrevMonth } from "./utils/getDaysSincePrevMonth";
import { usePrevious } from "./utils/usePrevious";
import { TICKS_PER_DAY } from "./utils/constants";
import { getTicksAmount } from "./utils/getTicksAmount";

const DayComponent = memo(
  ({
    dateString,
    selected,
    setSelected,
  }: {
    dateString: string;
    selected: string;
    setSelected: (date: string) => void;
  }) => {
    return (
      <Pressable
        onPress={() => setSelected(dateString)}
        className="gap-y-2"
        style={{
          backgroundColor:
            dateString === selected ? colors.bgBlue(0.5) : undefined,
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        <Text
          className="font-semibold"
          style={{
            textAlign: "center",
            fontSize: 12,

            // fontFamily:fonts.Medium,
            color: dateString === selected ? colors.bgBlue(1) : "white",
          }}
        >
          {dateString.split("-")[2]}
        </Text>
        <Image
          source={require("../../assets/images/moon.png")}
          style={{ width: 15, height: 15 }}
        />
      </Pressable>
    );
  }
);

interface MoonPhaseCalendarProps {
  data: WeatherData;
  currentCalendarDate: string;
  userScrolledIndex: number;
  flatlistRef: RefObject<FlatList>;
  setUserScrolledIndex: (index: number) => void;
  offsetX: SharedValue<number>;
}

const MoonPhaseCalendar = ({
  data,
  currentCalendarDate,
  userScrolledIndex,
  flatlistRef,
  setUserScrolledIndex,
  offsetX,
}: MoonPhaseCalendarProps) => {
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

  const fullMoonDataObjectCopy = fullMoonDateObject;
  const newMoonDateObject = new Date(
    fullMoonDataObjectCopy.setDate(fullMoonDateObject.getDate() + 29.53 / 2)
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

  console.log(userScrolledIndex);

  const scrolledToDate = Math.min(
    Math.max(userScrolledIndex + 1, 1),
    whiteTicks - 1
  );

  const dateDay =
    scrolledToDate < 28
      ? scrolledToDate
      : scrolledToDate < 28 + 31
      ? scrolledToDate - 28
      : scrolledToDate - (28 + 31);

  const month = scrolledToDate < 28 ? 2 : scrolledToDate < 28 + 31 ? 3 : 4;

  const scrollToThis = new Date(2025, month - 1, dateDay).toLocaleDateString(
    "en-CA",
    {
      timeZone: data.location.tz_id,
    }
  );
  console.log(scrolledToDate);
  const selectedRef = useRef(currentCalendarDate);

  selectedRef.current = scrollToThis;

  const handleDayPress = (day: { dateString: string; timestamp: number }) => {
    const daysSincePrevMonthOfSelected = getDaysSincePrevMonth(
      new Date(day.timestamp)
    );
    setUserScrolledIndex(daysSincePrevMonthOfSelected);
    offsetX.value = daysSincePrevMonthOfSelected * 120;
    flatlistRef.current?.scrollToIndex({
      index: (daysSincePrevMonthOfSelected * 120) / 10,
      animated: false,
    });
  };

  type CalendarArrow = "left" | "right" | "none";
  const disabledArrowRef = useRef<CalendarArrow>("none");
  const selectedMonth = parseInt(selectedRef.current.split("-")[1]);
  const accountForZeroIndex = 1;
  const prevMonth = new Date().getUTCMonth() + accountForZeroIndex - 1;
  const nextMonth = new Date().getUTCMonth() + accountForZeroIndex + 1;

  const [disabledArrow, setDisabledArrow] = useState<CalendarArrow>("none");

  const monthUserWasJustOn = usePrevious(selectedMonth);

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
          // dayComponent={({ date }: { date: { dateString: string } }) => (
          //   <DayComponent
          //     dateString={date.dateString}
          //     selected={selected}
          //     setSelected={(date: string) => setSelected(date)}
          //   />
          // )}
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
        ></Calendar>
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
