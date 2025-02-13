import { View, Text, ScrollView, TextInput, Image } from "react-native";
import React, { RefObject } from "react";
import Search from "./Search";
import LocationName from "./LocationName";
import RoundedTemperature from "./RoundedTemperature";
import WeatherName from "./WeatherName";
import HighsAndLows from "./HighsAndLows";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";
import { Current, Forecast, Location } from "@/app";

export interface WeatherAtLocationProps {
  handleTextDebounce: (value: string) => void;
  showSearch: boolean;
  toggleSearch: (textInputRef: RefObject<TextInput>) => void;
  searchResultLocations: Location[];
  handleLocation: (location: Location) => void;
  location?: Location;
  current?: Current;
  forecast?: Forecast;
  getDate: (dateString: string) => string;
}

const WeatherAtLocation = ({
  handleTextDebounce,
  showSearch,
  toggleSearch,
  searchResultLocations,
  location,
  handleLocation,
  current,
  forecast,
  getDate,
}: WeatherAtLocationProps) => {
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
      <View className="mx-4 flex justify-around flex-1 mb-2 ">
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
        <View className="flex-row justify-center">
          <HourlyForecast forecast={forecast} location={location} />
        </View>

        <DailyForecast
          forecast={forecast}
          getDate={getDate}
          current={current}
        />
      </View>
    </ScrollView>
  );
};

export default WeatherAtLocation;
