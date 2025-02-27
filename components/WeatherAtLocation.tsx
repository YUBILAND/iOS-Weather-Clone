import { Location } from "@/constants/constants";
import { RootState } from "@/state/store";
import React, { RefObject, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import AirQualityCard from "./air-quality/AirQualityCard";
import HighsAndLows from "./atoms/HighsAndLows";
import LocationName from "./atoms/LocationName";
import RoundedTemperature from "./atoms/RoundedTemperature";
import Search from "./atoms/Search";
import WeatherName from "./atoms/WeatherName";
import DailyForecast from "./daily-forecast/DailyForecast";
import HourlyForecast from "./hourly-forecast/HourlyForecastCard";
import SunPhaseCard from "./sun-phase/SunPhaseCard";
import UVIndexCard from "./uv-index/UVIndexCard";
import DropdownComponent from "./modal/dropdown/DropdownComponent";

export type SelectModal = "hourly" | "sunphase";

export interface WeatherAtLocationProps {
  handleTextDebounce: (value: string) => void;
  showSearch: boolean;
  toggleSearch: (textInputRef: RefObject<TextInput>) => void;
  searchResultLocations: Location[];
  handleLocation: (location: Location) => void;
  getDate: (dateString: string) => string;
  cityName: string;
}

const WeatherAtLocation = ({
  handleTextDebounce,
  showSearch,
  toggleSearch,
  searchResultLocations,
  handleLocation,
  getDate,
  cityName,
}: WeatherAtLocationProps) => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const { location, forecast, current } = data[cityName];

  const [modalVisible, setModalVisible] = useState<SelectModal | null>(null);

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
            high={forecast?.forecastday[0].day.maxtemp_c ?? "undefined"}
            low={forecast?.forecastday[0].day.mintemp_c ?? "undefined"}
            className="flex-row gap-x-2 justify-center items-center "
            textClasses="text-2xl font-semibold"
          />
        </View>

        {/* Hourly Forecast */}
        <HourlyForecast
          cityName={cityName}
          modalVisible={modalVisible === "hourly"}
          setModalVisible={(modal: SelectModal | null) =>
            setModalVisible(modal)
          }
          modalID={"hourly"}
        />

        <DailyForecast cityName={cityName} getDate={getDate} />

        <AirQualityCard cityName={cityName} />

        <View className="flex-row gap-x-2 h-48">
          <View className="flex-[0.5]">
            <UVIndexCard cityName={cityName} />
          </View>
          <View className="flex-[0.5]">
            <SunPhaseCard
              graphHeight={60}
              cityName={cityName}
              modalVisible={modalVisible === "sunphase"}
              setModalVisible={setModalVisible}
              modalID={"sunphase"}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default WeatherAtLocation;
