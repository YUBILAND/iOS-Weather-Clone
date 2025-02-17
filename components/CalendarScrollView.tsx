import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { days } from "@/utils/exampleForecast";
import DefaultText from "./DefaultText";
import { colors } from "@/assets/colors/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";

const CalendarScrollView = ({ cityName }: { cityName: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const { location, forecast, current } = data[cityName];

  const exampleArray = [...Array(15).keys()];

  const daysLetter = days.map((day) => day[0]);

  const currentIndex = 0;

  const [conditionDate, setConditionDate] = useState("");

  useEffect(() => {
    if (location) {
      const now = new Date();

      const weekday = now.toLocaleString("en-US", {
        timeZone: location?.tz_id,
        weekday: "long",
      });
      const tzs = new Intl.DateTimeFormat("en-US", {
        timeZone: location?.tz_id,
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const tmz = tzs.format(now);
      // console.log(tmz);
      setConditionDate(tmz);
    }
  }, []);
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
          <View key={index} className="gap-y-4 items-center">
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
          {conditionDate}
        </DefaultText>
      </View>
    </>
  );
};

export default CalendarScrollView;
