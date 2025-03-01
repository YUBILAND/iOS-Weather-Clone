import { StatusBar } from "expo-status-bar";
import React, { RefObject, useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  ImageBackground,
  FlatList,
  Animated,
} from "react-native";

import { createTamagui, TamaguiProvider } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4"; // for quick config install this

import { debounce } from "lodash";
import { fetchLocations } from "@/api/weather";
import { getData } from "@/utils/asyncStorage";
import Spinner from "@/components/atoms/Spinner";
import "../global.css";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

import { useWindowDimensions } from "react-native";
import WeatherAtLocation, {
  WeatherAtLocationProps,
} from "@/components/WeatherAtLocation";

import { ExpandingDot } from "react-native-animated-pagination-dots";
import { colors } from "@/assets/colors/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { fetchWeatherData } from "@/state/api/apiSlice";
import { Location } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  // AsyncStorage.clear();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const [showSearch, setShowSearch] = useState(false);
  const [searchResultLocations, setSearchResultLocations] = useState<
    Location[]
  >([]);
  const [weatherScreens, setWeatherScreens] = useState([]);
  const [update, setUpdate] = useState(false);

  const FirstCity = async () => {
    const cityArray = await getData("city");
    console.log(cityArray);
    setWeatherScreens(cityArray);
  };

  // Fetch the weather data when the component mounts
  useEffect(() => {
    dispatch(fetchWeatherData());
    FirstCity();
  }, [update]);

  const currentCity = weatherScreens[0];
  const cityData = data[currentCity];

  // add new location
  const handleLocation = async (location: Location) => {
    try {
      await dispatch(fetchWeatherData(location.name));

      setShowSearch(false);
      setSearchResultLocations([]);
      setUpdate(!update);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSearch = (value: string): void => {
    // fetch location based on autocomplete of user input
    let autoCompleteMinimumLength = 2;
    if (value.length > autoCompleteMinimumLength) {
      fetchLocations(value).then((data) => {
        setSearchResultLocations(data);
        console.log(data);
      });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const toggleSearch = (textInputRef: RefObject<TextInput>) => {
    setShowSearch((prevState) => !prevState);

    !showSearch ? textInputRef.current?.focus() : textInputRef.current?.blur();
  };

  const { width } = useWindowDimensions();
  const scrollX = React.useRef(new Animated.Value(0)).current;

  if (loading) {
    return (
      <View className="flex-1 relative">
        <StatusBar style="light" />
        <Image
          blurRadius={70}
          className="absolute h-full w-full"
          source={require("../assets/images/bg.png")}
        />

        <Spinner />
      </View>
    );
  }

  if (!cityData) {
    return (
      <View className="flex-1 relative">
        <StatusBar style="light" />
        <Image
          blurRadius={70}
          className="absolute h-full w-full"
          source={require("../assets/images/bg.png")}
        />

        <Text>No weather api data available</Text>
      </View>
    );
  }

  const props = {
    handleTextDebounce,
    showSearch,
    toggleSearch,
    searchResultLocations,
    handleLocation,
  };

  const dataProp: Array<{ id: string } & WeatherAtLocationProps> =
    weatherScreens.map((city, index) => ({
      id: city,
      ...props,
      cityName: city,
    }));

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

  const config = createTamagui(defaultConfig);

  return (
    <TamaguiProvider config={config}>
      <View className="flex-1 relative">
        <StatusBar style="light" />
        <Image
          blurRadius={70}
          className="absolute h-full w-full"
          source={require("../assets/images/bg.png")}
        />

        <SafeAreaView className="flex flex-1 ">
          <View className="relative pb-10 h-full">
            {/* Bottom Footer */}
            <ImageBackground
              className="w-full h-10 absolute bottom-0 right-0 "
              source={require("../assets/images/bg.png")}
              imageStyle={{ resizeMode: "cover", top: -700 }}
              blurRadius={70}
            >
              <View className="mx-4 mt-3 flex-row justify-between">
                <Ionicons name="map-outline" size={25} color={"white"} />

                <ExpandingDot {...expandingDotProps} data={dataProp} />

                <FontAwesome6 name="list-ul" size={20} color={"white"} />
              </View>
            </ImageBackground>

            {/* Weather at location */}
            <FlatList
              {...flatlistProps}
              data={dataProp}
              keyExtractor={(item: { id: string }) => item.id}
              renderItem={({
                item,
              }: {
                item: { id: string } & WeatherAtLocationProps;
              }) => {
                const { id, ...restProps } = item;
                return <WeatherAtLocation {...restProps} />;
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    </TamaguiProvider>
  );
};
export default App;
