import { colors } from "@/assets/colors/colors";
import {
  getChordLength,
  getCurrentDate,
  getCurrentTime,
  getDaysOfMonth,
  getRemainingTimeUntilNextPhase,
  militaryHour,
  removeZeroFromTimeString,
  stringToTime,
} from "@/hooks/hooks";
import { RootState } from "@/state/store";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TextInput,
  Vibration,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import MoonPhaseGraph from "./MoonPhaseGraph";
import { Ionicons } from "@expo/vector-icons";
import MoonTimeSticks from "./MoonTimeSticks";
import * as Haptics from "expo-haptics";
import { weekday } from "@/constants/constants";
import { getShortWeekday } from "../daily-forecast/utils/getShortWeekday";
import { getTimeUntilNextFullMoonDate } from "./utils/getNextFullMoonDate";
import { getScrolledDate } from "./utils/getScrolledDate";
import { getTicksAmount } from "./utils/getTicksAmount";
import { getTickArr } from "./utils/getTickArr";
import MoonPhaseModalInfo from "./MoonPhaseModalInfo";
import MoonPhaseCalendar from "./MoonPhaseCalendar";
import MoonModalDescription from "./MoonModalDescription";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type MoonPhaseModalProps = {
  cityName: string;
  nextPhaseTime: string;
};

const MoonPhaseModal = ({ cityName, nextPhaseTime }: MoonPhaseModalProps) => {
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { moonPath: 0, sunPosition: 0, phaseLine: 0 },
  });
  const { data } = useSelector((state: RootState) => state.weather);
  const { location } = data[cityName];

  const { width } = Dimensions.get("window");
  const ICON_SIZE = 14;
  const ICON_BLACK_BORDER_SIZE = ICON_SIZE + 2;

  const TICKS_PER_DAY = 12;
  const OFFSETX_PER_TICK = 10;

  const { americanTime } = useSelector((state: RootState) => state.settings);

  const currentTime = getCurrentTime(location?.tz_id);

  const remainingTime = getRemainingTimeUntilNextPhase(
    currentTime,
    nextPhaseTime
  );

  // const sunPhaseInfo = getSunPhaseInfo(data[cityName], americanTime);
  const prevMonth = new Date().getMonth();

  const daysInPrevMonth = getDaysOfMonth(2025, prevMonth);

  const currentDate = getCurrentDate(data[cityName].location.tz_id);
  const localeDay = currentDate.day;

  //Not including first day
  const daysSincePrevMonth = daysInPrevMonth - 1 + localeDay;
  // console.log(daysInPrevMonth);
  // console.log(localeDay);

  // console.log(daysSincePrevMonth);

  const flatlistRef = useRef<FlatList>(null);

  const { whiteTicks, totalTicks } = useMemo(() => getTicksAmount(), []);

  const flatlistRenderAmount: { id: number; weekday: string }[] =
    useMemo(() => {
      return getTickArr(whiteTicks, totalTicks);
    }, []);

  const renderItem = ({ item }: { item: { id: number; weekday: string } }) => {
    return (
      <MoonTimeSticks
        item={item}
        arrLength={totalTicks}
        daysSincePrevMonth={daysSincePrevMonth}
      />
    );
  };

  const keyExtractor = useCallback(
    (_: { id: number }, index: number) => index.toString(),
    []
  );

  const getItemLayout = (
    data: ArrayLike<{ id: number; weekday: string }> | null | undefined,
    index: number
  ) => {
    if (!data) {
      return { length: 0, offset: 0, index }; // Return default values when data is undefined or null
    }
    return {
      length: 10, // The height of each item (fixed-size)
      offset: 10 * index,
      index,
    };
  };

  const tickPosition = useSharedValue(0);
  const sharedDate = useSharedValue("");

  const offsetX = useSharedValue(
    TICKS_PER_DAY * OFFSETX_PER_TICK * daysSincePrevMonth
  );

  const handleHaptic = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetX.value = event.nativeEvent.contentOffset.x;
    const scrollPosToDateString = getScrolledDate(
      data[cityName],
      offsetX.value,
      tickPosition
    );
    // sharedDate.value = scrollPosToDateString;

    // In this format ["Thu", " 3/6"]
    sharedDate.value =
      scrollPosToDateString.split(",")[1].replace(/\s+/, "") +
      ", " +
      scrollPosToDateString.split(",")[0];
  };

  const scrolledDate = useAnimatedProps(() => {
    const position = `${sharedDate.value}`;
    return {
      text: position,
      value: position,
    };
  });

  return (
    <View>
      <View style={{ backgroundColor: "black" }}>
        <MoonPhaseGraph
          cityName={cityName}
          state={state}
          isActive={isActive}
          graphHeight={250}
          strokeWidth={6}
        />

        {/* Date text */}
        <View className="" style={{ alignItems: "center" }}>
          <AnimatedTextInput
            editable={false}
            underlineColorAndroid={"transparent"}
            style={[
              {
                fontSize: 30,
                color: "white",
                fontWeight: 800,
                width: 20,
              },
            ]}
            animatedProps={scrolledDate}
          />
        </View>
      </View>

      {/* Scroll */}
      <View className="pt-4 " style={{ backgroundColor: "black" }}>
        <View className="relative">
          <Ionicons
            className="absolute top-0 left-[50%] "
            name="triangle"
            size={ICON_BLACK_BORDER_SIZE}
            color={"black"}
            style={{
              transform: [{ rotate: "180deg" }],
              zIndex: 1,
              left: width / 2 - ICON_BLACK_BORDER_SIZE / 2,
              alignSelf: "flex-start",
            }}
          />
          <Ionicons
            className="absolute top-0 left-[50%] "
            name="triangle"
            size={ICON_SIZE}
            color={"white"}
            style={{
              transform: [{ rotate: "180deg" }],
              zIndex: 1,
              left: width / 2 - ICON_SIZE / 2,
              alignSelf: "flex-start",
            }}
          />
        </View>
        <View className="relative z-0">
          <FlatList
            ref={flatlistRef}
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              gap: 8,
              paddingHorizontal: false ? 0 : width / 2,
            }}
            initialNumToRender={50}
            maxToRenderPerBatch={100}
            windowSize={10}
            getItemLayout={getItemLayout}
            data={flatlistRenderAmount}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={handleHaptic}
            initialScrollIndex={TICKS_PER_DAY * daysSincePrevMonth}
          />
        </View>
      </View>

      <MoonPhaseModalInfo data={data[cityName]} />

      <MoonPhaseCalendar data={data[cityName]} />

      <MoonModalDescription data={data[cityName]} />
    </View>
  );
};

export default MoonPhaseModal;
