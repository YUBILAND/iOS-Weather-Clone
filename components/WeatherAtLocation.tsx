import { Location } from "@/constants/constants";
import { RootState } from "@/state/store";
import React, { RefObject, useRef, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
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
import WindCard from "./wind-forecast/WindCard";
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
  const [selectedModal, setSelectedModal] = useState<SelectModal>("moonPhase");

  const { americanTime } = useSelector((state: RootState) => state.settings);

  const currentTime = getCurrentTime(location?.tz_id);
  const nextPhaseTime = getNextPhaseTime(
    data[cityName],
    currentTime,
    americanTime
  );

  const openModalOnIndexRef = useRef<boolean>(false);

  const iconSize = 18;

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
              forecast?.forecastday[0].day.maxtemp_c.toString() ?? "undefined"
            }
            low={
              forecast?.forecastday[0].day.mintemp_c.toString() ?? "undefined"
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
          >
            <MoonPhaseModal cityName={cityName} nextPhaseTime={nextPhaseTime} />
          </ModalContainer>
        ) : (
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
        )}

        <View className="gap-y-2">
          {/* Hourly Forecast */}
          <HourlyForecastCard
            cityName={cityName}
            showModal={() => {
              setSelectedModal("temperature");
              setCurrentIndex(0);
              setModalVisible(true);
            }}
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

          <View className="flex-row gap-x-2 h-48">
            <View className="flex-[0.5]">
              <UVIndexCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => {
                  setSelectedModal("uv");
                  setCurrentIndex(0);
                  setModalVisible(true);
                }}
              />
            </View>
            <View className="flex-[0.5]">
              <SunPhaseCard
                graphHeight={60}
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => {
                  setSelectedModal("sunPhase");
                  setModalVisible(true);
                }}
              />
            </View>
          </View>

          <WindCard
            cityName={cityName}
            iconSize={iconSize}
            showModal={() => {
              setSelectedModal("wind");
              setCurrentIndex(0);
              setModalVisible(true);
            }}
          />

          <View className="flex-row gap-x-2 h-48">
            <View className="flex-[0.5]">
              <WindChillCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => {
                  setSelectedModal("windChill");
                  setCurrentIndex(0);

                  setModalVisible(true);
                }}
              />
            </View>
            <View className="flex-[0.5]">
              <PrecipitationCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => {
                  setSelectedModal("precipitation");
                  setCurrentIndex(0);

                  setModalVisible(true);
                }}
              />
            </View>
          </View>

          <View className="flex-row gap-x-2 h-48">
            <View className="flex-[0.5]">
              <VisibilityCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => {
                  setSelectedModal("visibility");
                  setCurrentIndex(0);
                  setModalVisible(true);
                }}
              />
            </View>
            <View className="flex-[0.5]">
              <HumidityCard
                cityName={cityName}
                iconSize={iconSize}
                showModal={() => {
                  setSelectedModal("humidity");
                  setCurrentIndex(0);
                  setModalVisible(true);
                }}
              />
            </View>
          </View>

          <MoonPhaseCard
            cityName={cityName}
            iconSize={iconSize}
            showModal={() => {
              setSelectedModal("moonPhase");
              setCurrentIndex(0);
              setModalVisible(true);
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default WeatherAtLocation;
