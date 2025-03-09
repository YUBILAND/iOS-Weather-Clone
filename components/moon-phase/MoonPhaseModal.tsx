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
import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  Vibration,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  SharedValue,
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
import {
  ICON_BLACK_BORDER_SIZE,
  ICON_SIZE,
  MoonPhase,
  OFFSETX_PER_TICK,
  TICKS_PER_DAY,
} from "./utils/constants";
import { getCurrentMoonPhase } from "./utils/getCurrentMoonPhase";
import { getDaysSincePrevMonth } from "./utils/getDaysSincePrevMonth";
import { getRemoveAnimationRef } from "./utils/getRemoveAnimationRef";
import { formatScrollPosDate } from "./utils/formatScrollPosDate";

type MoonPhaseModalProps = {
  cityName: string;
  flatlistRef: RefObject<FlatList>;
  sharedDate: SharedValue<string>;
  offsetX: SharedValue<number>;
  userScrolledIndex: number;
  setUserScrolledIndex: (index: number) => void;
  currentMoonPhase: MoonPhase;
  daysSincePrevMonth: number;
};

const MoonPhaseModal = ({
  cityName,
  flatlistRef,
  sharedDate,
  offsetX,
  userScrolledIndex,
  setUserScrolledIndex,
  currentMoonPhase,
  daysSincePrevMonth,
}: MoonPhaseModalProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { width } = Dimensions.get("window");

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
      length: 120, // The height of each item (fixed-size)
      offset: 120 * index,
      index,
    };
  };

  const tickPosition = useSharedValue(0);

  const handleHaptic = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetX.value = event.nativeEvent.contentOffset.x;
    // console.log(offsetX.value);
    const scrollPosToDateString = getScrolledDate(
      data[cityName],
      offsetX.value,
      tickPosition,
      (offset: number) => setUserScrolledIndex(offset)
    );
    // In this format ["Thu", " 3/6"]
    sharedDate.value = formatScrollPosDate(scrollPosToDateString);
  };

  // Scrolled Date Style

  const paddingHorizontalTinyOffset = 1;

  const moonLuminToPhase = (percent: number) => {
    if (currentMoonPhase === "waxing") {
      if (percent === 0) {
        return "New Moon";
      } else if (percent >= 1 && percent <= 49) {
        return "Waxing Crescent";
      } else if (percent >= 50) {
        return "First Quarter";
      } else if (percent >= 51 && percent <= 99) {
        return "Waxing Gibbous";
      } else if (percent === 100) {
        return "Full Moon";
      }
    } else {
      if (percent === 100) {
        return "Full Moon";
      } else if (percent >= 51 && percent <= 99) {
        return "Waning Gibbous";
      } else if (percent >= 50) {
        return "Last Quarter";
      } else if (percent >= 1 && percent <= 49) {
        return "Waning Crescent";
      } else if (percent === 0) {
        return "New Moon";
      }
    }
  };

  const currentCalendarDate = new Date().toLocaleDateString("en-CA", {
    timeZone: data[cityName].location.tz_id,
  });

  return (
    <>
      {/* Scroll */}
      <View className="pt-4 " style={{ backgroundColor: "black" }}>
        <View className="relative">
          {/* Triangle Marker */}
          <>
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
          </>
        </View>
        <View className="relative z-0">
          <FlatList
            ref={flatlistRef}
            decelerationRate={0.5}
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              // gap: 8,

              paddingHorizontal: false
                ? 0
                : width / 2 - paddingHorizontalTinyOffset,
            }}
            initialNumToRender={50}
            maxToRenderPerBatch={100}
            windowSize={50}
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

      <MoonPhaseCalendar
        data={data[cityName]}
        currentCalendarDate={currentCalendarDate}
        userScrolledIndex={userScrolledIndex}
        setUserScrolledIndex={(index: number) => setUserScrolledIndex(index)}
        flatlistRef={flatlistRef}
        offsetX={offsetX}
      />

      <MoonModalDescription data={data[cityName]} />
    </>
  );
};

export default MoonPhaseModal;
