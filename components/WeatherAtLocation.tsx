import { colors } from "@/assets/colors/colors";
import { getCurrentTime, stringToTime } from "@/hooks/hooks";
import { RootState } from "@/state/store";
import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import AirPressureCard from "./air-pressure/AirPressureCard";
import AirQualityCard from "./air-quality/AirQualityCard";
import CardsContainer from "./atoms/CardsContainer";
import HighsAndLows from "./atoms/HighsAndLows";
import LocationName from "./atoms/LocationName";
import RoundedTemperature from "./atoms/RoundedTemperature";
import TwoCards from "./atoms/TwoCards";
import WeatherName from "./atoms/WeatherName";
import DailyForecastCard from "./daily-forecast/DailyForecastCard";
import HourlyForecastCard from "./hourly-forecast/HourlyForecastCard";
import HumidityCard from "./humidity/HumidityCard";
import Modal from "./modal/Modal";
import ModalContainer from "./modal/ModalContainer";
import {
  modalDropdownObjects,
  SelectModal,
} from "./modal/utils/modalConstants";
import MoonPhaseCard from "./moon-phase/MoonPhaseCard";
import MoonPhaseGraph from "./moon-phase/MoonPhaseGraph";
import MoonPhaseModal from "./moon-phase/MoonPhaseModal";
import { OFFSETX_PER_TICK, TICKS_PER_DAY } from "./moon-phase/utils/constants";
import { getCurrentMoonPhase } from "./moon-phase/utils/getCurrentMoonPhase";
import { getDaysSincePrevMonth } from "./moon-phase/utils/getDaysSincePrevMonth";
import PrecipitationCard from "./precipitation/PrecipitationCard";
import SunPhaseCard from "./sun-phase/SunPhaseCard";
import SunPhaseModal from "./sun-phase/SunPhaseModal";
import { getNextPhaseTime } from "./sun-phase/utils/getNextPhaseTime";
import UVIndexCard from "./uv-index/UVIndexCard";
import VisibilityCard from "./visibility/VisibilityCard";
import WindChillCard from "./wind-chill/WindChillCard";
import WindCard from "./wind-forecast/card/WindCard";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import AveragesCard from "./averages/AveragesCard";
import WindMapCard from "./wind-map/WindMapCard";
import AveragesModal from "./averages/AveragesModal";
import AveragesModalDescription from "./averages/AveragesModalDescription";
import { getTemperature } from "@/hooks/useDisplayUnits";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import DefaultText from "./atoms/DefaultText";
import MinimizedTemp from "./atoms/MinimizedTemp";
import {
  Canvas,
  Circle,
  Fill,
  Group,
  Paint,
  rect,
  Rect,
  translate,
  useImage,
  Image,
  BlendMode,
  Mask,
} from "@shopify/react-native-skia";
import { useLayout } from "@/hooks/useLayout";
import OpacityCard from "./atoms/OpacityCard";
import { BlurView } from "expo-blur";
import CardTitle from "./atoms/CardTitle";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import { getLocationHeaderStyles } from "@/hooks/getLocationHeaderStyles";
import VisualHeightChange from "@/hooks/VisualHeightChange";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface WeatherAtLocationProps {
  cityName: string;
}

const iconSize = 18;

export const textShadowStyle: TextStyle = {
  textShadowColor: "rgba(0, 0, 0, 0.5)",
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 4,
};

const WeatherAtLocation = ({ cityName }: WeatherAtLocationProps) => {
  const data = useWeatherData();
  const is12Hr = useIs12Hr();
  const tempUnit = useTemperatureUnit();

  const { location, forecast, current } = data[cityName];

  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedModal, setSelectedModal] = useState<SelectModal | null>(null);

  const currentIndexRef = useRef<number>(0);
  const openModalOnIndexRef = useRef<boolean>(false);
  const flatlistRef = useRef<FlatList>(null);

  const { state } = useChartPressState({
    x: 0,
    y: { moonPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const sharedDate = useSharedValue("");

  const scrolledDate = useAnimatedProps(() => {
    const position = `${sharedDate.value}`;
    return {
      text: position,
      value: position,
    };
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      fontSize: 30,
      color: "white",
      fontWeight: 800,
      width: 200,
      marginLeft: 100,
    };
  });

  const currentTime = getCurrentTime(location?.tz_id);
  const nextPhaseTime = stringToTime(
    is12Hr,
    getNextPhaseTime(data[cityName], currentTime)
  );

  const daysSincePrevMonth = useMemo(() => getDaysSincePrevMonth(), []);
  const initialScrollPosition = TICKS_PER_DAY * daysSincePrevMonth * 10;
  const initialScrollIndex = initialScrollPosition / 10;

  const offsetX = useSharedValue(
    TICKS_PER_DAY * OFFSETX_PER_TICK * daysSincePrevMonth
  );

  const [userScrolledIndex, setUserScrolledIndex] =
    useState(initialScrollIndex);

  const currentMoonPhase = getCurrentMoonPhase(
    data[cityName],
    userScrolledIndex,
    initialScrollIndex
  );
  const initialMoonPhase = getCurrentMoonPhase(
    data[cityName],
    initialScrollIndex,
    initialScrollIndex
  );

  const showThisModal = useCallback((modalName: SelectModal) => {
    setSelectedModal(modalName);
    setCurrentIndex(0);
    setModalVisible(true);
  }, []);

  const modalCallbacks = useMemo(
    () => ({
      conditions: () => showThisModal("conditions"),
      airQuality: () => showThisModal("airQuality"),
      uv: () => showThisModal("uv"),
      wind: () => showThisModal("wind"),
      humidity: () => showThisModal("humidity"),
      airPressure: () => showThisModal("airPressure"),
      feelsLike: () => showThisModal("feelsLike"),
      precipitation: () => showThisModal("precipitation"),
      visibility: () => showThisModal("visibility"),
      averages: () => showThisModal("averages"),
      sunPhase: () => showThisModal("sunPhase"),
      moonPhase: () => showThisModal("moonPhase"),
    }),
    [showThisModal]
  );

  console.log("Flatlist rerendered");

  const currentTemp = Math.round(getTemperature(current?.temp_c!));
  const currentHigh = Math.round(
    getTemperature(forecast?.forecastday[0].day.maxtemp_c!)
  );
  const currentLow = Math.round(
    getTemperature(forecast?.forecastday[0].day.mintemp_c!)
  );

  const scrollViewPadding = 180;
  const gapLength = 10;

  // Responsible for keeping track of scroll position
  const scrolledDownShared = useSharedValue(0);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollYDistance = event.nativeEvent.contentOffset.y;
    scrolledDownShared.value = scrollYDistance;
  };

  const {
    highAndLowOpacityStyle,
    conditionOpacityStyle,
    tempOpacityStyle,
    minimizedTempOpacityStyle,
  } = getLocationHeaderStyles(scrolledDownShared);
  const {
    collapseStyle: hourlyCollapse,
    heightStyle: hourlyHeight,
    removalOpacityStyle: hourlyRemoval,
    oldTitleOpacityStyle,
    newTitleOpacityStyle,
    layoutHeight: hourlyLayoutHeight,
    onLayout: hourlyOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollViewPadding, gapLength, 0, 0);
  const {
    collapseStyle: dailyCollapse,
    heightStyle: dailyHeight,
    removalOpacityStyle: dailyRemoval,
    layoutHeight: dailyLayoutHeight,
    onLayout: dailyOnLayout,
  } = getAnimatedStyles(
    scrolledDownShared,
    scrollViewPadding,
    gapLength,
    hourlyLayoutHeight ?? 0,
    1
  );
  const {
    collapseStyle: airQualityCollapse,
    heightStyle: airQualityHeight,
    removalOpacityStyle: airQualityRemoval,
    layoutHeight: airQualityLayoutHeight,
    onLayout: airQualityOnLayout,
  } = getAnimatedStyles(
    scrolledDownShared,
    scrollViewPadding,
    gapLength,
    (hourlyLayoutHeight ?? 0) + (dailyLayoutHeight ?? 0),
    2
  );
  const {
    collapseStyle: uvCollapse,
    heightStyle: uvHeight,
    removalOpacityStyle: uvRemoval,
    layoutHeight: uvLayoutHeight,
    onLayout: uvOnLayout,
  } = getAnimatedStyles(
    scrolledDownShared,
    scrollViewPadding,
    gapLength,
    (hourlyLayoutHeight ?? 0) +
      (dailyLayoutHeight ?? 0) +
      (airQualityLayoutHeight ?? 0),
    3
  );
  const {
    collapseStyle: windCollapse,
    heightStyle: windHeight,
    removalOpacityStyle: windRemoval,
    layoutHeight: windLayoutHeight,
    onLayout: windOnLayout,
  } = getAnimatedStyles(
    scrolledDownShared,
    scrollViewPadding,
    gapLength,
    (hourlyLayoutHeight ?? 0) +
      (dailyLayoutHeight ?? 0) +
      (airQualityLayoutHeight ?? 0) +
      (uvLayoutHeight ?? 0),
    4
  );
  const {
    collapseStyle: windChillCollapse,
    heightStyle: windChillHeight,
    removalOpacityStyle: windChillRemoval,
    layoutHeight: windChillLayoutHeight,
    onLayout: windChillOnLayout,
  } = getAnimatedStyles(
    scrolledDownShared,
    scrollViewPadding,
    gapLength,
    (hourlyLayoutHeight ?? 0) +
      (dailyLayoutHeight ?? 0) +
      (airQualityLayoutHeight ?? 0) +
      (uvLayoutHeight ?? 0) +
      (windLayoutHeight ?? 0),
    5
  );
  const {
    collapseStyle: visCollapse,
    heightStyle: visHeight,
    removalOpacityStyle: visRemoval,
    layoutHeight: visLayoutHeight,
    onLayout: visOnLayout,
  } = getAnimatedStyles(
    scrolledDownShared,
    scrollViewPadding,
    gapLength,
    (hourlyLayoutHeight ?? 0) +
      (dailyLayoutHeight ?? 0) +
      (airQualityLayoutHeight ?? 0) +
      (uvLayoutHeight ?? 0) +
      (windLayoutHeight ?? 0) +
      (windChillLayoutHeight ?? 0),
    6
  );

  return (
    <>
      <View className="flex-col">
        <Animated.View className="mt-10 ">
          <View className="relative">
            <LocationName
              location={location}
              className="text-center text-5xl"
              style={textShadowStyle}
            />

            <View
              // onLayout={onLayout}
              className="absolute top-full left-0 w-screen gap-y-2"
            >
              <Animated.View style={tempOpacityStyle}>
                <RoundedTemperature
                  temperature={currentTemp}
                  className="text-center pl-5"
                  style={{
                    fontSize: 100,
                    lineHeight: 100,
                    marginBottom: -20,
                    fontWeight: 200,
                    ...textShadowStyle,
                  }}
                />
              </Animated.View>

              <View>
                <Animated.View style={conditionOpacityStyle}>
                  <WeatherName
                    weatherName={current?.condition.text}
                    className="text-center text-xl"
                    style={textShadowStyle}
                  />
                </Animated.View>

                <Animated.View style={highAndLowOpacityStyle}>
                  <View className="flex-row gap-x-2 justify-center items-center ">
                    <HighsAndLows
                      high={currentHigh}
                      low={currentLow}
                      textClasses="text-xl font-semibold"
                      style={textShadowStyle}
                    />
                  </View>
                </Animated.View>
              </View>
            </View>
          </View>

          <View className="relative">
            <Animated.View
              className="justify-center"
              style={minimizedTempOpacityStyle}
            >
              <MinimizedTemp
                currentTemp={currentTemp}
                currentCondition={current?.condition.text}
                viewTw="justify-center flex-row gap-4 mb-2"
                style={textShadowStyle}
              />
            </Animated.View>
          </View>
        </Animated.View>

        <ScrollView
          style={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          className="w-screen "
          stickyHeaderIndices={[6, 5, 4, 3, 2, 1, 0]}
          contentContainerStyle={{
            gap: gapLength,
            paddingTop: scrollViewPadding,
          }}
          onScroll={handleScroll}
        >
          {/* View element has static height, so scrollview won't break */}
          {/* Animated View will show the height visually change */}

          <VisualHeightChange
            onLayout={hourlyOnLayout}
            layoutHeight={hourlyLayoutHeight}
            heightAnimation={hourlyHeight}
            removalAnimation={hourlyRemoval}
          >
            <HourlyForecastCard
              cityName={cityName}
              showModal={modalCallbacks.conditions}
              style={hourlyCollapse}
              title={
                <>
                  <Animated.View
                    className="flex-row ml-2 px-4"
                    style={oldTitleOpacityStyle}
                  >
                    <DefaultText>
                      {"It looks to be clear. Expect windy conditions at 10:00"}
                    </DefaultText>
                  </Animated.View>
                  <Animated.View
                    className="px-4 ml-2 absolute top-0 left-0"
                    style={newTitleOpacityStyle}
                  >
                    <CardTitle
                      title={"Hourly Forecast"}
                      icon={
                        <CalendarDaysIcon size={iconSize} color={"white"} />
                      }
                      className={"pb-2"}
                    />
                  </Animated.View>
                </>
              }
            />
          </VisualHeightChange>
          <VisualHeightChange
            onLayout={dailyOnLayout}
            layoutHeight={dailyLayoutHeight}
            heightAnimation={dailyHeight}
            removalAnimation={dailyRemoval}
          >
            <DailyForecastCard
              cityName={cityName}
              iconSize={iconSize}
              showModal={useCallback(() => {
                setSelectedModal("conditions");
                setModalVisible(true);
              }, [])}
              setCurrentIndex={(index: number) => setCurrentIndex(index)}
              openModalOnIndexRef={openModalOnIndexRef}
              collapseFromTopStyle={dailyCollapse}
            />
          </VisualHeightChange>

          <VisualHeightChange
            onLayout={airQualityOnLayout}
            layoutHeight={airQualityLayoutHeight}
            heightAnimation={airQualityHeight}
            removalAnimation={airQualityRemoval}
          >
            <AirQualityCard
              cityName={cityName}
              iconSize={iconSize}
              showModal={modalCallbacks.airQuality}
              collapseFromTopStyle={airQualityCollapse}
            />
          </VisualHeightChange>

          <TwoCards
            leftCard={
              <VisualHeightChange
                onLayout={uvOnLayout}
                layoutHeight={uvLayoutHeight}
                heightAnimation={uvHeight}
                removalAnimation={uvRemoval}
              >
                <UVIndexCard
                  cityName={cityName}
                  iconSize={iconSize}
                  showModal={modalCallbacks.uv}
                  collapseFromTopStyle={uvCollapse}
                />
              </VisualHeightChange>
            }
            rightCard={
              <VisualHeightChange
                onLayout={uvOnLayout}
                layoutHeight={uvLayoutHeight}
                heightAnimation={uvHeight}
                removalAnimation={uvRemoval}
              >
                <SunPhaseCard
                  graphHeight={60}
                  cityName={cityName}
                  iconSize={iconSize}
                  showModal={modalCallbacks.sunPhase}
                  collapseFromTopStyle={uvCollapse}
                />
              </VisualHeightChange>
            }
          />

          <VisualHeightChange
            onLayout={windOnLayout}
            layoutHeight={windLayoutHeight}
            heightAnimation={windHeight}
            removalAnimation={windRemoval}
          >
            <WindCard
              cityName={cityName}
              iconSize={iconSize}
              showModal={modalCallbacks.wind}
              collapseFromTopStyle={windCollapse}
            />
          </VisualHeightChange>

          <TwoCards
            leftCard={
              <VisualHeightChange
                onLayout={windChillOnLayout}
                layoutHeight={windChillLayoutHeight}
                heightAnimation={windChillHeight}
                removalAnimation={windChillRemoval}
              >
                <WindChillCard
                  cityName={cityName}
                  iconSize={iconSize}
                  showModal={modalCallbacks.feelsLike}
                  collapseFromTopStyle={windChillCollapse}
                />
              </VisualHeightChange>
            }
            rightCard={
              <VisualHeightChange
                onLayout={windChillOnLayout}
                layoutHeight={windChillLayoutHeight}
                heightAnimation={windChillHeight}
                removalAnimation={windChillRemoval}
              >
                <PrecipitationCard
                  cityName={cityName}
                  iconSize={iconSize}
                  showModal={modalCallbacks.precipitation}
                  collapseFromTopStyle={windChillCollapse}
                />
              </VisualHeightChange>
            }
          />

          <TwoCards
            leftCard={
              <VisualHeightChange
                onLayout={visOnLayout}
                layoutHeight={visLayoutHeight}
                heightAnimation={visHeight}
                removalAnimation={visRemoval}
              >
                <VisibilityCard
                  cityName={cityName}
                  iconSize={iconSize}
                  showModal={modalCallbacks.visibility}
                  collapseFromTopStyle={visCollapse}
                />
              </VisualHeightChange>
            }
            rightCard={
              <VisualHeightChange
                onLayout={visOnLayout}
                layoutHeight={visLayoutHeight}
                heightAnimation={visHeight}
                removalAnimation={visRemoval}
              >
                <HumidityCard
                  cityName={cityName}
                  iconSize={iconSize}
                  showModal={modalCallbacks.humidity}
                  collapseFromTopStyle={visCollapse}
                />
              </VisualHeightChange>
            }
          />

          {false && (
            <>
              <Canvas
                style={{
                  flex: 1,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 1000,
                  height: 200,
                  zIndex: 100,
                }}
              >
                {/* Top layer */}
                <Group>
                  {/* The filled layer */}
                  <Rect x={0} y={0} width={500} height={500} color="red" />

                  {/* "Clear" hole */}
                  <Circle
                    cx={150}
                    cy={150}
                    r={100}
                    color="white"
                    blendMode="clear"
                  />
                </Group>
              </Canvas>

              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 500,
                  height: 500,
                  backgroundColor: "blue",
                }}
              />

              {/* Skia Canvas for "hole" */}
              <Canvas
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 1000,
                  height: 1000,
                }}
              >
                {/* Punch a clear hole */}
                <Group>
                  <Circle
                    cx={150}
                    cy={150}
                    r={50}
                    color="white"
                    blendMode="clear" // This clears pixels
                  />
                </Group>
              </Canvas>
            </>
          )}

          {/* Causing delay when changing temperature */}
          <CardsContainer className="gap-y-2" style={{ zIndex: 10 }}>
            {/* <View className="mb-44"></View> */}

            {/* <WindMapCard cityName={cityName} /> */}

            <MoonPhaseCard
              cityName={cityName}
              iconSize={iconSize}
              userScrolledIndex={initialScrollIndex}
              currentMoonPhase={initialMoonPhase}
              initialScrollIndex={initialScrollIndex}
              showModal={modalCallbacks.moonPhase}
            />

            <TwoCards
              leftCard={
                <AveragesCard
                  cityName={cityName}
                  iconSize={iconSize}
                  showModal={modalCallbacks.averages}
                />
              }
              rightCard={
                <AirPressureCard
                  cityName={cityName}
                  iconSize={iconSize}
                  showModal={modalCallbacks.airPressure}
                />
              }
            />
          </CardsContainer>

          <>
            {selectedModal === "sunPhase" ? (
              <ModalContainer
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={"Sun Phase"}
                selectedModal={selectedModal}
              >
                <SunPhaseModal
                  cityName={cityName}
                  nextPhaseTime={nextPhaseTime}
                />
              </ModalContainer>
            ) : selectedModal === "moonPhase" ? (
              <ModalContainer
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={"Moon Phase"}
                selectedModal={selectedModal}
                backgroundColor={colors.darkGray}
                putMoonHere={
                  <View
                    style={{
                      backgroundColor: "black",
                    }}
                  >
                    <View
                      className="items-center"
                      style={{ paddingTop: 20, paddingBottom: 8 }}
                    >
                      <MoonPhaseGraph
                        cityName={cityName}
                        state={state}
                        graphHeight={250}
                        initialScrollIndex={initialScrollIndex}
                        userScrolledIndex={userScrolledIndex}
                        currentMoonPhase={currentMoonPhase}
                        showPercent
                        scaleDown={40}
                        // addLines
                      />
                    </View>

                    <View className="w-full flex-row items-center h-12">
                      <View style={{ flex: 20, alignItems: "center" }}>
                        {userScrolledIndex >= initialScrollIndex + 3 && (
                          <Ionicons
                            name="arrow-back-circle-outline"
                            size={40}
                            color={colors.bgBlue(1)}
                            onPress={() => {
                              setUserScrolledIndex(
                                Math.floor(initialScrollIndex)
                              );
                              offsetX.value = initialScrollPosition * 12;
                              flatlistRef.current?.scrollToIndex({
                                index:
                                  initialScrollPosition / (TICKS_PER_DAY * 10),
                                animated: false,
                              });
                            }}
                          />
                        )}
                      </View>

                      <View
                        style={{ flex: 60 }}
                        className="flex-row justify-center"
                      >
                        <AnimatedTextInput
                          editable={false}
                          underlineColorAndroid={"transparent"}
                          style={animatedStyle}
                          animatedProps={scrolledDate}
                        />
                      </View>

                      <View style={{ flex: 20, alignItems: "center" }}>
                        {userScrolledIndex <= initialScrollIndex - 3 && (
                          <Ionicons
                            name="arrow-forward-circle-outline"
                            size={40}
                            color={colors.bgBlue(1)}
                            onPress={() => {
                              setUserScrolledIndex(
                                Math.floor(
                                  initialScrollPosition / (TICKS_PER_DAY * 10)
                                )
                              );
                              offsetX.value = initialScrollPosition * 12;
                              flatlistRef.current?.scrollToIndex({
                                index:
                                  initialScrollPosition / (TICKS_PER_DAY * 10),
                                animated: false,
                              });
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                }
              >
                <MoonPhaseModal
                  cityName={cityName}
                  flatlistRef={flatlistRef}
                  sharedDate={sharedDate}
                  offsetX={offsetX}
                  userScrolledIndex={userScrolledIndex}
                  setUserScrolledIndex={(index: number) =>
                    setUserScrolledIndex(index)
                  }
                  currentMoonPhase={currentMoonPhase}
                  daysSincePrevMonth={daysSincePrevMonth}
                />
              </ModalContainer>
            ) : selectedModal ? (
              <ModalContainer
                modalVisible={modalVisible}
                setModalVisible={(visible: boolean) => setModalVisible(visible)}
                title={modalDropdownObjects[selectedModal].label}
                selectedModal={selectedModal}
              >
                <Modal
                  cityName={cityName}
                  currentIndex={currentIndex}
                  setCurrentIndex={(index: number) => setCurrentIndex(index)}
                  currentIndexRef={currentIndexRef}
                  selectedModal={selectedModal}
                  setSelectedModal={(modal: SelectModal) =>
                    setSelectedModal(modal)
                  }
                  openModalOnIndexRef={openModalOnIndexRef}
                />
              </ModalContainer>
            ) : (
              <></>
            )}
          </>
        </ScrollView>
      </View>
    </>
  );
};

export default React.memo(WeatherAtLocation);
