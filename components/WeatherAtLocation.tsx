import { Location } from "@/constants/constants";
import { RootState } from "@/state/store";
import React, { RefObject, useMemo, useRef, useState } from "react";
import { FlatList, ScrollView, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import AirQualityCard from "./air-quality/AirQualityCard";
import HighsAndLows from "./atoms/HighsAndLows";
import LocationName from "./atoms/LocationName";
import RoundedTemperature from "./atoms/RoundedTemperature";
import Search from "./atoms/Search";
import WeatherName from "./atoms/WeatherName";
import DailyForecast from "./daily-forecast/DailyForecastCard";
import HourlyForecast from "./hourly-forecast/HourlyForecastCard";
import SunPhaseCard from "./sun-phase/SunPhaseCard";
import UVIndexCard from "./uv-index/UVIndexCard";
import DropdownComponent from "./modal/dropdown/DropdownComponent";
import WindCard from "./wind-forecast/card/WindCard";
import DailyForecastCard from "./daily-forecast/DailyForecastCard";
import HourlyForecastCard from "./hourly-forecast/HourlyForecastCard";
import ModalContainer from "./modal/ModalContainer";
import {
  modalDropdownObjects,
  SelectModal,
} from "./modal/utils/modalConstants";
import Modal from "./modal/Modal";
import SunPhaseModal from "./sun-phase/SunPhaseModal";
import { getCurrentTime, getRemainingTimeUntilNextPhase } from "@/hooks/hooks";
import { getNextPhaseTime } from "./sun-phase/utils/getNextPhaseTime";
import WindChillCard from "./wind-chill/WindChillCard";
import PrecipitationCard from "./precipitation/PrecipitationCard";
import VisibilityCard from "./visibility/VisibilityCard";
import HumidityCard from "./humidity/HumidityCard";
import MoonPhaseCard from "./moon-phase/MoonPhaseCard";
import MoonPhaseModal from "./moon-phase/MoonPhaseModal";
import { colors } from "@/assets/colors/colors";
import MoonPhaseGraph from "./moon-phase/MoonPhaseGraph";
import { Ionicons } from "@expo/vector-icons";
import { useChartPressState } from "victory-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { OFFSETX_PER_TICK, TICKS_PER_DAY } from "./moon-phase/utils/constants";
import { getCurrentMoonPhase } from "./moon-phase/utils/getCurrentMoonPhase";
import { getDaysSincePrevMonth } from "./moon-phase/utils/getDaysSincePrevMonth";
import TwoCards from "./atoms/TwoCards";
import CardTitle from "./atoms/CardTitle";
import DefaultText from "./atoms/DefaultText";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface WeatherAtLocationProps {
  handleTextDebounce: (value: string) => void;
  showSearch: boolean;
  toggleSearch: (textInputRef: RefObject<TextInput>) => void;
  searchResultLocations: Location[];
  handleLocation: (location: Location) => void;
  cityName: string;
}

const WeatherAtLocation = ({
  handleTextDebounce,
  showSearch,
  toggleSearch,
  searchResultLocations,
  handleLocation,
  cityName,
}: WeatherAtLocationProps) => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const { location, forecast, current } = data[cityName];

  const [modalVisible, setModalVisible] = useState<boolean>(true);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentIndexRef = useRef<number>(0);
  const [selectedModal, setSelectedModal] = useState<SelectModal | null>(null);

  const { americanTime } = useSelector((state: RootState) => state.settings);

  const currentTime = getCurrentTime(location?.tz_id);
  const nextPhaseTime = getNextPhaseTime(
    data[cityName],
    currentTime,
    americanTime
  );

  const openModalOnIndexRef = useRef<boolean>(false);

  const iconSize = 18;

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

  const daysSincePrevMonth = useMemo(() => getDaysSincePrevMonth(), []);

  const initialScrollPosition = TICKS_PER_DAY * daysSincePrevMonth * 10;
  const initialScrollIndex = initialScrollPosition / 10;

  const flatlistRef = useRef<FlatList>(null);

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

  const showThisModal = (modalName: SelectModal) => {
    setSelectedModal(modalName);
    setCurrentIndex(0);
    setModalVisible(true);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="w-screen">
      {/* Search Section */}
      <View className="mx-4 relative z-50 h-fit">
        <Search
          handleTextDebounce={handleTextDebounce}
          showSearch={showSearch}
          toggleSearch={toggleSearch}
          searchResultLocations={searchResultLocations}
          handleLocation={handleLocation}
        />
      </View>
      {/* Forecast section */}
      <View className="mx-4 flex justify-around flex-1 mb-2">
        <View className="mb-8">
          <LocationName location={location} className="text-center text-5xl" />

          <RoundedTemperature
            temperature={parseInt(current?.temp_c!)}
            className="text-center pl-5"
            style={{
              // remove bottom padding due to line height
              fontSize: 128,
              lineHeight: 128,
              marginBottom: -20,
            }}
          />

          <WeatherName
            weatherName={current?.condition.text}
            className="text-center text-2xl tracking-widest"
          />

          <HighsAndLows
            high={
              Math.round(forecast?.forecastday[0].day.maxtemp_c).toString() ??
              "undefined"
            }
            low={
              Math.round(forecast?.forecastday[0].day.mintemp_c).toString() ??
              "undefined"
            }
            className="flex-row gap-x-2 justify-center items-center "
            textClasses="text-2xl font-semibold"
          />
        </View>

        {/* Modal Component */}
        {selectedModal === "sunPhase" ? (
          <ModalContainer
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            title={"Sun Phase"}
            iconName="sun-o"
          >
            <SunPhaseModal cityName={cityName} nextPhaseTime={nextPhaseTime} />
          </ModalContainer>
        ) : selectedModal === "moonPhase" ? (
          <ModalContainer
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            title={"Moon Phase"}
            iconName="moon-o"
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
                    initialScrollPosition={initialScrollPosition}
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
                          setUserScrolledIndex(Math.floor(initialScrollIndex));
                          offsetX.value = initialScrollPosition * 12;
                          flatlistRef.current?.scrollToIndex({
                            index: initialScrollPosition / (TICKS_PER_DAY * 10),
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
                            index: initialScrollPosition / (TICKS_PER_DAY * 10),
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
            iconName="cloud"
          >
            <Modal
              cityName={cityName}
              currentIndex={currentIndex}
              setCurrentIndex={(index: number) => setCurrentIndex(index)}
              currentIndexRef={currentIndexRef}
              selectedModal={selectedModal}
              setSelectedModal={(modal: SelectModal) => setSelectedModal(modal)}
              openModalOnIndexRef={openModalOnIndexRef}
            />
          </ModalContainer>
        ) : (
          <View></View>
        )}

        <View className="gap-y-2">
          {/* Hourly Forecast */}
          <HourlyForecastCard
            cityName={cityName}
            showModal={() => showThisModal("temperature")}
          />

          <DailyForecastCard
            cityName={cityName}
            iconSize={iconSize}
            showModal={() => {
              setSelectedModal("temperature");
              setModalVisible(true);
            }}
            setCurrentIndex={(index: number) => setCurrentIndex(index)}
            openModalOnIndexRef={openModalOnIndexRef}
          />

          <AirQualityCard cityName={cityName} iconSize={iconSize} />

          <TwoCards
            leftCard={
              <UVIndexCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => showThisModal("uv")}
              />
            }
            rightCard={
              <SunPhaseCard
                graphHeight={60}
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => showThisModal("sunPhase")}
              />
            }
          />

          <WindCard
            cityName={cityName}
            iconSize={iconSize}
            showModal={() => showThisModal("wind")}
          />

          <TwoCards
            leftCard={
              <WindChillCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => showThisModal("windChill")}
              />
            }
            rightCard={
              <PrecipitationCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => showThisModal("precipitation")}
              />
            }
          />

          <View className="flex-row gap-x-2 h-48">
            <View className="flex-[0.5]">
              <VisibilityCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => showThisModal("visibility")}
              />
            </View>
            <View className="flex-[0.5]">
              <HumidityCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => showThisModal("humidity")}
              />
            </View>
          </View>

          <MoonPhaseCard
            cityName={cityName}
            iconSize={iconSize}
            userScrolledIndex={userScrolledIndex}
            currentMoonPhase={currentMoonPhase}
            initialScrollPosition={initialScrollPosition}
            showModal={() => showThisModal("moonPhase")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default WeatherAtLocation;
