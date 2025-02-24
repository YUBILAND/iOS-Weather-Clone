import {
  View,
  Text,
  FlatList,
  ViewToken,
  useWindowDimensions,
} from "react-native";
import React, { MutableRefObject, useCallback, useMemo } from "react";
import DefaultText from "../atoms/DefaultText";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { weatherPNG } from "@/utils/exampleForecast";
import { weatherKey } from "@/constants/constants";

type Item = {
  id: number;
  title?: string;
};

type FlatListProps = {
  horizontal: boolean;
  decelerationRate: number;
  snapToInterval: number; // Use the screen width
  snapToAlignment: "center" | "start" | "end" | undefined;
  showsHorizontalScrollIndicator: boolean;
  pagingEnabled: boolean;
  data: { id: number }[];
  renderItem: ({ item }: { item: { id: number } }) => React.ReactElement;
  keyExtractor: (item: { id: number }, index: number) => string;
  onViewableItemsChanged: ({
    viewableItems,
  }: {
    viewableItems: ViewToken<{ id: number }>[];
  }) => void;
  viewabilityConfig: {
    itemVisiblePercentThreshold: number;
  };
  ref: React.RefObject<FlatList>;
  getItemLayout: (
    data: ArrayLike<Item> | null | undefined,
    index: number
  ) => { length: number; offset: number; index: number };
};
const MemoizedFlatList = React.memo(
  ({
    cityName,
    flatlistRef,
    setCurrentIndex,
    scrollRef,
  }: {
    cityName: string;
    flatlistRef: React.RefObject<FlatList>;
    setCurrentIndex: (index: number) => void;
    scrollRef: MutableRefObject<boolean>;
  }) => {
    const { data } = useSelector((state: RootState) => state.weather);
    const { location, forecast, current } = data[cityName];
    const graphData: { id: number }[] = useMemo(() => {
      return Array(3)
        .fill(0)
        .map((_, idx) => ({ id: idx }));
    }, []);

    const { width } = useWindowDimensions();
    // const scrollX = React.useRef(new RNAnimated.Value(0)).current;

    const flatlistProps = {
      horizontal: true,
      decelerationRate: 0,
      snapToInterval: width, // Use the screen width
      snapToAlignment: "center" as const,
      showsHorizontalScrollIndicator: false,
      pagingEnabled: true,
      // onScroll: RNAnimated.event(
      //   [{ nativeEvent: { contentOffset: { x: scrollX } } }],
      //   { useNativeDriver: false }
      // ),
    };

    const handleViewableItemsChanged = ({
      viewableItems,
    }: {
      viewableItems: ViewToken<{
        id: number;
      }>[];
    }) => {
      // console.log("Visible items are", viewableItems[0].index);
      scrollRef.current = false; // Update the ref value
      setCurrentIndex(viewableItems[0]?.index ?? 2); // Update state
      // console.log(viewableItems[0]?.index);
    };
    // Empty dependency array means this function is memoized

    const renderItem = useCallback(({ item }: { item: { id: number } }) => {
      const currentTemperature = Math.round(parseFloat(current?.temp_c));
      const maxTemperature = Math.round(
        parseFloat(forecast?.forecastday[item.id].day.maxtemp_c)
      );
      const minTemperature = Math.round(
        parseFloat(forecast?.forecastday[item.id].day.mintemp_c)
      );

      const currentWeatherImage =
        weatherKey[weatherPNG(current?.condition.text, current?.is_day)];

      const DailyWeatherImage =
        weatherKey[
          weatherPNG(forecast?.forecastday[item.id].day.condition.text)
        ];

      return (
        <View className="w-screen">
          {/* Temperature graph */}
          <DefaultText>Goodbye</DefaultText>

          {/* Precipitation graph */}
          <DefaultText>Hello</DefaultText>
        </View>
      );
    }, []);

    const keyExtractor = useCallback(
      (_: { id: number }, index: number) => index.toString(),
      []
    );

    const MemoizedFlatList = React.memo(
      React.forwardRef<FlatList, FlatListProps>(
        (
          {
            horizontal,
            decelerationRate,
            snapToInterval,
            snapToAlignment,
            showsHorizontalScrollIndicator,
            pagingEnabled,
            data,
            renderItem,
            keyExtractor,
            onViewableItemsChanged,
            viewabilityConfig,
            getItemLayout,
          },
          ref
        ) => (
          <FlatList
            horizontal={horizontal}
            decelerationRate={decelerationRate}
            snapToInterval={snapToInterval}
            snapToAlignment={snapToAlignment}
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
            pagingEnabled={pagingEnabled}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            ref={ref}
            getItemLayout={getItemLayout}
          />
        )
      )
    );
    return (
      <MemoizedFlatList
        {...flatlistProps}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        ref={flatlistRef}
        data={graphData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({
          length: width, // Height of each item
          offset: width * index, // Offset of each item
          index,
        })}
      />
    );
  }
);

export default MemoizedFlatList;
