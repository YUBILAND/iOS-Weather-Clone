import { colors } from "@/assets/colors/colors";
import { weatherKey } from "@/constants/constants";
import { RootState } from "@/state/store";
import { weatherPNG } from "@/utils/exampleForecast";
import React, {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Image,
  useWindowDimensions,
  View,
  Animated as RNAnimated,
  ViewToken,
} from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import { shallowEqual, useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import PrecipitationGraph from "../graphs/PrecipitationGraph";
import TemperatureGraph from "../graphs/TemperatureGraph";
import CalendarScrollView from "../modal/CalendarScrollView";
import GraphContainer from "../modal/GraphContainer";
import ModalBoxTitle from "../modal/ModalBoxTitle";
import ModalTextBoxContainer from "../modal/ModalTextBoxContainer";
import { getCalendarDate } from "@/hooks/hooks";

Animated.addWhitelistedNativeProps({ value: true, source: true });

type ConditionModalProps = {
  cityName: string;
};

const HourlyModal = ({ cityName }: ConditionModalProps) => {
  // Chart Press State for temperature

  const temperatureStateRef = useRef();

  const { state: tempState, isActive: tempIsActive } = useChartPressState({
    x: 0,
    y: {
      celsius: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  // Chart Press State for precipitation
  const { state: rainState, isActive: rainIsActive } = useChartPressState({
    x: 0,
    y: {
      chanceOfRain: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setUpdate(!update);
    });
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {

  //   setUpdate1(!update1);
  // })

  // }, [update]);

  const tempScrollInfoBold = useAnimatedProps(() => {
    const celsius = `${Math.round(tempState.y.celsius.value.value)}°`;
    return {
      text: celsius,
      value: celsius,
    };
  });
  const rainScrollInfoBold = useAnimatedProps(() => {
    const chanceOfRain = `${Math.round(rainState.y.chanceOfRain.value.value)}%`;
    return {
      text: chanceOfRain,
      value: chanceOfRain,
    };
  });

  const { data } = useSelector((state: RootState) => state.weather);
  const { location, forecast, current } = data[cityName];

  const flatlistRef = useRef<FlatList>(null);

  const hourlyTempMap = forecast?.forecastday[0].hour.map((hour) =>
    Math.round(parseFloat(hour.temp_c))
  );
  const maxCelsius = Math.max(...hourlyTempMap);
  const minCelsius = Math.min(...hourlyTempMap);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentIndexRef = useRef<number>(0);

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

  const currentlyScrollingRef = useRef<boolean>(true);

  // If user is scrolling, animate the scroll
  if (flatlistRef.current && currentlyScrollingRef.current) {
    console.log("currentIndex is ", currentIndex);
    flatlistRef.current.scrollToIndex({ animated: true, index: currentIndex });
  }

  const handleViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<{
        id: number;
      }>[];
    }) => {
      if (!currentlyScrollingRef.current) {
        // console.log("Visible items are", viewableItems[0].index);
        setCurrentIndex(viewableItems[0]?.index ?? 0); // Update state
      }
      currentlyScrollingRef.current = false;
    },
    []
  ); // Empty dependency array means this function is memoized

  const renderItem = ({ item }: { item: { id: number } }) => {
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
      weatherKey[weatherPNG(forecast?.forecastday[item.id].day.condition.text)];

    return (
      <View className="w-screen">
        {/* Temperature graph */}
        <GraphContainer
          cityName={cityName}
          state={tempState}
          isActive={tempIsActive}
          hackyWeatherImage
          scrollInfoBold={tempScrollInfoBold}
          currentIndex={item.id}
          leftSide={
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                <DefaultText className="text-4xl">
                  {item.id === 0 ? currentTemperature : maxTemperature}
                  &#176;
                </DefaultText>
                {item.id != 0 && (
                  <DefaultText
                    className="text-4xl"
                    style={{ color: colors.lightGray }}
                  >
                    {minTemperature}&#176;
                  </DefaultText>
                )}
                <Image
                  source={
                    item.id === 0 ? currentWeatherImage : DailyWeatherImage
                  }
                  style={{ width: 40, height: 40 }}
                />
              </View>
              <View>
                {item.id === 0 ? (
                  <DefaultText style={{ color: colors.lightGray }}>
                    H: {maxCelsius}&#176; L: {minCelsius}&#176;
                  </DefaultText>
                ) : (
                  <DefaultText style={{ color: colors.lightGray }}>
                    Celsius
                  </DefaultText>
                )}
              </View>
            </>
          }
        >
          <TemperatureGraph
            cityName={cityName}
            state={tempState}
            isActive={tempIsActive}
            graphHeight={200}
            strokeWidth={4}
            yAxisLabel="°"
            currentIndex={item.id}
          />
        </GraphContainer>
        {/* Precipitation graph */}
        <GraphContainer
          cityName={cityName}
          state={rainState}
          isActive={rainIsActive}
          scrollInfoBold={rainScrollInfoBold}
          smallBold
          currentIndex={item.id}
          leftSide={
            <View className="h-12" style={{ justifyContent: "center" }}>
              <DefaultText className="text-2xl font-semibold ">
                Rain Probability
              </DefaultText>
            </View>
          }
        >
          <PrecipitationGraph
            cityName={cityName}
            state={rainState}
            isActive={rainIsActive}
            graphHeight={200}
            strokeWidth={4}
            yAxisLabel="%"
            currentIndex={item.id}
          />
        </GraphContainer>
      </View>
    );
  };

  const keyExtractor = useCallback(
    (_: { id: number }, index: number) => index.toString(),
    []
  );

  return (
    <>
      {/* Calendar */}
      <View>
        <CalendarScrollView
          cityName={cityName}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          currentIndexRef={currentIndexRef}
          scrollRef={currentlyScrollingRef}
        />

        <HorizontalLine />
      </View>

      {/* Graphs */}
      <>
        {/* Weather at location */}
        <FlatList
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          {...flatlistProps}
          ref={flatlistRef}
          data={graphData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </>

      <View className="px-4">
        <View>
          <ModalBoxTitle title="Total Rainfall" />

          <ModalTextBoxContainer>
            <View className="gap-y-2">
              <DefaultText>Last 24 hours</DefaultText>
              <View className="flex-row justify-between">
                <DefaultText>Precipitation</DefaultText>
                <DefaultText>0"</DefaultText>
              </View>
            </View>

            <HorizontalLine />

            <View className="gap-y-2">
              <DefaultText>Last 24 hours</DefaultText>
              <View className="flex-row justify-between">
                <DefaultText>Precipitation</DefaultText>
                <DefaultText>0"</DefaultText>
              </View>
            </View>
          </ModalTextBoxContainer>
        </View>

        <View>
          <ModalBoxTitle title="Forecast" />

          <ModalTextBoxContainer>
            <View className="text-balance ">
              <DefaultText className="font-semibold">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis,
                illo harum cupiditate accusantium et voluptate nemo earum
                placeat! Necessitatibus quibusdam saepe voluptate libero
                doloremque quo dolores deleniti ab quam molestiae!
              </DefaultText>
            </View>
          </ModalTextBoxContainer>
        </View>

        <View>
          <ModalBoxTitle title="Compared to yesterday" />

          <ModalTextBoxContainer removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>Today is hotter than yesterday</DefaultText>
            </View>

            <HorizontalLine />

            <View className="gap-y-2 px-4">
              <View className="flex-row ">
                <DefaultText className="flex-[0.2]">Today</DefaultText>
                <DefaultText className="flex-[0.8]">
                  <View className="items-center w-full">
                    <DefaultText>Progress Bar</DefaultText>
                  </View>
                </DefaultText>
              </View>

              <View className="flex-row justify-between">
                <DefaultText className="flex-[0.2]">Yesterday</DefaultText>
                <DefaultText className="flex-[0.8]">
                  <View className="items-center w-full">
                    <DefaultText>Progress Bar</DefaultText>
                  </View>
                </DefaultText>
              </View>
            </View>
          </ModalTextBoxContainer>
        </View>

        <View>
          <ModalBoxTitle title="Option" />

          <ModalTextBoxContainer>
            <View className="flex-row justify-between">
              <DefaultText>Metric</DefaultText>
              <DefaultText>Use system settings C°</DefaultText>
            </View>
          </ModalTextBoxContainer>
        </View>
      </View>
    </>
  );
};

export default HourlyModal;
