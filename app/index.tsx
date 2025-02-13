import { StatusBar } from "expo-status-bar";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView,
  ImageBackground,
  FlatList,
  Animated,
} from "react-native";

import { WeatherType } from "@/constants/constants";

import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "@/api/weather";

import { getData, storeData } from "@/utils/asyncStorage";
import Search from "@/components/Search";
import LocationName from "@/components/LocationName";
import WeatherImage from "@/components/WeatherImage";
import Temperature from "@/components/Temperature";
import WeatherName from "@/components/WeatherName";
import WindSpeed from "@/components/WindSpeed";
import Humidity from "@/components/Humidity";
import Sunrise from "@/components/Sunrise";
import WeekForecast from "@/components/WeekForecast";
import Spinner from "@/components/Spinner";
import HighsAndLows from "@/components/HighsAndLows";
import "../global.css";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import RoundedTemperature from "@/components/RoundedTemperature";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

import { useWindowDimensions } from "react-native";
import WeatherAtLocation, {
  WeatherAtLocationProps,
} from "@/components/WeatherAtLocation";

import { ExpandingDot } from "react-native-animated-pagination-dots";
import { colors } from "@/assets/colors/colors";

type WeatherData = {
  current?: Current;
  location?: Location;
  forecast?: Forecast;
};

export type Current = {
  temp_c: string;
  wind_kph: string;
  humidity: string;
  condition: Condition;
};

type Condition = {
  text: WeatherType;
};

export type Location = {
  country: string;
  id: number;
  name: string;
};

export type Forecast = {
  forecastday: ForecastObject[];
};

export type ForecastObject = {
  day: {
    maxtemp_c: string;
    mintemp_c: string;
    avgtemp_c: string;
    condition: Condition;
  };
  date: string;
  astro: {
    sunrise: string;
  };
  hour: HourObject[];
};

type HourObject = WeatherData["current"] & {
  time: string;
};

export default function Index() {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<WeatherData>({});
  const [loading, setLoading] = useState(true);

  const { current, location, forecast } = weather;

  let forecastDays = 10;

  const handleLocation = (location: Location) => {
    setShowSearch(false);
    setLocations([]);
    setLoading(true);
    fetchWeatherForecast(location.name, forecastDays).then((data) => {
      console.log("got forecast: ", data);
      setWeather(data);
      setLoading(false);
      storeData("city", location.name);
    });
  };

  const handleSearch = (value: string): void => {
    // fetch location based on autocomplete of user input
    let autoCompleteMinimumLength = 2;
    if (value.length > autoCompleteMinimumLength) {
      fetchLocations(value).then((data) => {
        setLocations(data);
        console.log(data);
      });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const getDate = (dateString: string) => {
    let date = new Date(dateString);
    let options: Intl.DateTimeFormatOptions = { weekday: "long" };
    let dayName = date.toLocaleDateString("en-US", options);
    return dayName;
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData("city");
    let cityName = "Tokyo";
    if (myCity) cityName = myCity;
    fetchWeatherForecast(cityName, forecastDays).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const toggleSearch = (textInputRef: RefObject<TextInput>) => {
    setShowSearch((prevState) => !prevState);

    !showSearch ? textInputRef.current?.focus() : textInputRef.current?.blur();
  };

  const { width } = useWindowDimensions();

  const props = {
    handleTextDebounce,
    showSearch,
    toggleSearch,
    locations,
    location,
    handleLocation,
    current,
    forecast,
    getDate,
  };

  type flatlistType = WeatherAtLocationProps & {
    id: string;
  };

  const data: flatlistType[] = [
    { id: "1", ...props }, // Add a unique `id` for each item
    { id: "2", ...props },
  ];

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const flatlistProps = {
    horizontal: true,
    decelerationRate: 0,
    snapToInterval: width, // Use the screen width
    snapToAlignment: "center" as const,
    showsHorizontalScrollIndicator: false,
    pagingEnabled: true,
    onScroll: Animated.event(
      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
      { useNativeDriver: false }
    ),
  };

  const expandingDotProps = {
    expandingDotWidth: 10,
    scrollX: scrollX,
    inActiveDotOpacity: 0.6,
    activeDotColor: colors.bgWhite(0.8),
    inActiveDotColor: colors.bgWhite(0.5),

    dotStyle: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    containerStyle: {
      position: "relative" as const,
      top: 0,
    },
  };

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        className="absolute h-full w-full"
        source={require("../assets/images/bg.png")}
      />

      {loading ? (
        <Spinner />
      ) : (
        <SafeAreaView className="flex flex-1 ">
          <View className="relative pb-10">
            {/* Bottom Footer */}
            <ImageBackground
              className="w-full h-10 absolute bottom-0 right-0 "
              source={require("../assets/images/bg.png")}
              imageStyle={{ resizeMode: "cover", top: -700 }}
              blurRadius={70}
            >
              <View className="mx-4 mt-3 flex-row justify-between">
                <Ionicons name="map-outline" size={25} color={"white"} />

                <ExpandingDot {...expandingDotProps} data={data} />

                <FontAwesome6 name="list-ul" size={20} color={"white"} />
              </View>
            </ImageBackground>

            {/* Weather at location */}
            <FlatList
              {...flatlistProps}
              data={data}
              keyExtractor={(item: { id: string }) => item.id}
              renderItem={({ item }: { item: flatlistType }) => {
                const { id, ...restProps } = item;
                return <WeatherAtLocation {...restProps} />;
              }}
            />
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
