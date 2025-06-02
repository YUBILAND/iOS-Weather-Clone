import { useWeatherData } from "@/hooks/useWeatherData";
import React, { RefObject, useCallback, useMemo } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import MoonModalDescription from "./MoonModalDescription";
import MoonPhaseCalendar from "./MoonPhaseCalendar";
import MoonPhaseModalInfo from "./MoonPhaseModalInfo";
import MoonTimeSticks from "./MoonTimeSticks";
import TriangleMarker from "./TriangleMarker";
import { TICKS_PER_DAY } from "./utils/constants";
import { formatScrollPosDate } from "./utils/formatScrollPosDate";
import { getInitialScrollIndex } from "./utils/getInitialScrollIndex";
import { getScrolledDate } from "./utils/getScrolledDate";
import { getTickArr } from "./utils/getTickArr";
import { getTicksAmount } from "./utils/getTicksAmount";

type MoonPhaseModalProps = {
  cityName: string;
  flatlistRef: RefObject<FlatList>;
  sharedDate: SharedValue<string>;
  userScrolledIndex: number;
  setUserScrolledIndex: (index: number) => void;
};

const MoonPhaseModal = ({
  cityName,
  flatlistRef,
  sharedDate,
  userScrolledIndex,
  setUserScrolledIndex,
}: MoonPhaseModalProps) => {
  const data = useWeatherData();
  const { width } = Dimensions.get("window");

  const { daysSincePrevMonth, initialScrollPosition } = getInitialScrollIndex();
  const flatlistPosition = useSharedValue(initialScrollPosition * 12);

  // For FlatList
  const { whiteTicks, totalTicks } = useMemo(() => getTicksAmount(), []);
  const flatlistRenderAmount: { id: number; weekday: string }[] =
    useMemo(() => {
      return getTickArr(whiteTicks, totalTicks - 1);
    }, []);
  const renderItem = ({ item }: { item: { id: number; weekday: string } }) => {
    return (
      <MoonTimeSticks
        item={item}
        arrLength={totalTicks - 1}
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
    flatlistPosition.value = event.nativeEvent.contentOffset.x;

    const scrollPosToDateString = getScrolledDate(
      data[cityName],
      event.nativeEvent.contentOffset.x,
      tickPosition,
      (offset: number) => setUserScrolledIndex(offset)
    );
    // In this format ["Thu", " 3/6"]
    sharedDate.value = formatScrollPosDate(scrollPosToDateString);
  };

  const paddingHorizontalTinyOffset = 1;
  const contentContainerStyle = {
    paddingHorizontal: false ? 0 : width / 2 - paddingHorizontalTinyOffset,
  };

  const FlatListProps = {
    ref: flatlistRef,
    decelerationRate: 0.5,
    showsHorizontalScrollIndicator: false,
    horizontal: true,
    contentContainerStyle: contentContainerStyle,
    initialNumToRender: 50,
    maxToRenderPerBatch: 100,
    windowSize: 50,
    getItemLayout: getItemLayout,
    data: flatlistRenderAmount,
    keyExtractor: keyExtractor,
    renderItem: renderItem,
    onScroll: handleHaptic,
    initialScrollIndex: TICKS_PER_DAY * daysSincePrevMonth,
  };

  const MoonPhaseModalInfoProps = {
    data: data[cityName],
    userScrolledIndex: userScrolledIndex,
    initialScrollIndex: TICKS_PER_DAY * daysSincePrevMonth,
  };

  const MoonPhaseCalendarProps = {
    data: data[cityName],
    userScrolledIndex: userScrolledIndex,
    setUserScrolledIndex: (index: number) => setUserScrolledIndex(index),
    flatlistRef: flatlistRef,
    flatlistPosition: flatlistPosition,
  };

  return (
    <>
      {/* Scroll */}
      <View className="pt-4 " style={{ backgroundColor: "black" }}>
        <View className="relative">
          <TriangleMarker width={width} />
        </View>
        <View className="relative z-0">
          <FlatList {...FlatListProps} />
        </View>
      </View>

      <MoonPhaseModalInfo {...MoonPhaseModalInfoProps} />

      <MoonPhaseCalendar {...MoonPhaseCalendarProps} />

      <MoonModalDescription data={data[cityName]} />
    </>
  );
};

export default MoonPhaseModal;
