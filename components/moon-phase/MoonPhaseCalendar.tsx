import { View, Text, Pressable, Image } from "react-native";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import React, { memo, useState } from "react";
import {
  Calendar,
  CalendarProvider,
  LocaleConfig,
} from "react-native-calendars";
import { WeatherData } from "@/constants/constants";
import { SharedValue } from "react-native-reanimated";
import HorizontalLine from "../atoms/HorizontalLine";
import { FontWeight } from "@shopify/react-native-skia";
import { getTimeUntilNextFullMoonDate } from "./utils/getNextFullMoonDate";

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
}

const MoonPhaseCalendar = ({ data }: MoonPhaseCalendarProps) => {
  const date = new Date().toLocaleDateString("en-CA", {
    timeZone: data.location.tz_id,
  });

  const [selected, setSelected] = useState(date);

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

  return (
    <>
      <View className=" px-4">
        <DefaultText
          className="uppercase font-semibold text-2xl pb-2 pl-2"
          style={{ letterSpacing: 2 }}
        >
          Calendar
        </DefaultText>
        <Calendar
          hideExtraDays
          style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
          theme={{
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
            disabledArrowColor: "#d9e1e8",
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
          }}
          onDayPress={(day: { dateString: any }) => {
            setSelected(day.dateString);
          }}
          // dayComponent={({ date }: { date: { dateString: string } }) => (
          //   <DayComponent
          //     dateString={date.dateString}
          //     selected={selected}
          //     setSelected={(date: string) => setSelected(date)}
          //   />
          // )}
          markingType={"custom"}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              customStyles: {
                container: {
                  borderRadius: 10,
                  backgroundColor:
                    selected === date
                      ? colors.bgBlue(0.6)
                      : colors.bgWhite(0.4),
                  // content: require("../../assets/images/windy.png"),
                  content: "Hello",
                  color: "white",
                },
                text: {
                  color: selected === date ? colors.bgBlue(1) : "white",
                  fontWeight: "bold",
                },
              },
            },

            [date]: {
              customStyles: {
                text: {
                  color: colors.bgBlue(1),
                },
              },
            },
          }}
        />
        <HorizontalLine />
        <View
          className=""
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
