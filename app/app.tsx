import { StatusBar } from "expo-status-bar";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  Image,
  TextInput,
  View,
  ViewToken,
} from "react-native";

import { fetchLocations } from "@/api/weather";
import Spinner from "@/components/atoms/Spinner";
import { getData, getTempUnit } from "@/utils/asyncStorage";
import { debounce } from "lodash";
import "../global.css";

import WeatherAtLocation, {
  WeatherAtLocationProps,
} from "@/components/WeatherAtLocation";
import { useWindowDimensions } from "react-native";

import BottomFooter from "@/components/atoms/BottomFooter";
import { Location } from "@/constants/constants";
import { fetchWeatherData } from "@/state/api/apiSlice";
import { AppDispatch, RootState } from "@/state/store";
import { getWeatherName, weatherNameToCardBg } from "@/utils/exampleForecast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { CrossfadeImage } from "react-native-crossfade-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  fetchIs12Hr,
  fetchOtherUnits,
  fetchTempUnit,
} from "@/state/settings/settingsSlice";
import LocationModal from "@/components/location-modal/LocationModal";

const App = () => {
  // Delete All Weather Screens
  const resetWeatherScreens = false;
  if (resetWeatherScreens) {
    AsyncStorage.clear();
  }

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const [showSearch, setShowSearch] = useState(false);
  const [weatherScreens, setWeatherScreens] = useState<string[]>([]);
  const [searchResultLocations, setSearchResultLocations] = useState<
    Location[]
  >([]);

  const changeWeatherScreens = (weatherScreenArr: string[]) => {
    setWeatherScreens(weatherScreenArr);
  };

  // Fetch Weather Screens In Async Storage
  const FirstCity = async () => {
    const cityArray = await getData("city");
    setWeatherScreens(cityArray);
  };

  // Temporary fix for weather screen not showing upon adding new location
  useEffect(() => {
    dispatch(fetchWeatherData());

    FirstCity();
    // Should fetch from async storage and update redux
    dispatch(fetchTempUnit());
    dispatch(fetchIs12Hr());
    dispatch(fetchOtherUnits());
  }, []);

  // Add New Weather Location when click on city name
  const handleLocation = async (location: Location) => {
    setShowLocationModal(false);

    try {
      await dispatch(fetchWeatherData(location.name));
      setShowSearch(false);
      setSearchResultLocations([]);
      FirstCity();

      // setUpdate(!update);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  // Handle search functionality
  const handleSearch = (value: string): void => {
    // fetch location based on autocomplete of user input
    let autoCompleteMinimumLength = 2;
    if (value.length > autoCompleteMinimumLength) {
      fetchLocations(value).then((data) => {
        setSearchResultLocations(data);
        // console.log(data);
      });
    }
  };
  // Delay in user typing until result to reduce api calls and smoothen experience
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  // Show Search Text Box
  const toggleSearch = (textInputRef: RefObject<TextInput>) => {
    setShowSearch((prevState) => !prevState);
    !showSearch ? textInputRef.current?.focus() : textInputRef.current?.blur();
  };

  // if (!cityData) {
  //   return (
  //     <View className="flex-1 relative">
  //       <StatusBar style="light" />
  //       <Image
  //         blurRadius={70}
  //         className="absolute h-full w-full"
  //         source={require("../assets/images/bg.png")}
  //       />

  //       <Text>No weather api data available</Text>
  //     </View>
  //   );
  // }

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

  // Get Weather Background
  const currentCityName = weatherScreens[currentCardIndex];
  const background = weatherNameToCardBg(
    getWeatherName(data[currentCityName]?.current.condition.code),
    data[currentCityName]?.current.is_day
  );

  // For FlatList
  const { width } = useWindowDimensions();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const dataProp: Array<{ id: string } & WeatherAtLocationProps> = useMemo(
    () =>
      weatherScreens.map((city, index) => ({
        id: city,
        cityName: city,
      })),
    [weatherScreens]
  );
  const flatlistProps = {
    horizontal: true, // Horizontal
    decelerationRate: 0, //Quick deceleration
    snapToInterval: width, // Use the screen width
    snapToAlignment: "center" as const, // Snap to center
    showsHorizontalScrollIndicator: false, // No scrollbar
    // pagingEnabled: true,
    onScroll: Animated.event(
      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
      { useNativeDriver: false }
    ),
  };
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const currentIndex = viewableItems[0].index;
      if (currentIndex != null) {
        setCurrentCardIndex(currentIndex);
      }
    },
    [weatherScreens]
  );
  const handleRenderItem = useCallback(
    ({ item }: { item: { id: string } & WeatherAtLocationProps }) => {
      const { id, ...restProps } = item;
      return <WeatherAtLocation {...restProps} />;
    },
    []
  );

  // For Location Modal
  const [showLocationModal, setShowLocationModal] = useState(false);
  const flatlistRef = useRef<FlatList>(null);
  const handleShowWeatherScreen = (index: number) => {
    flatlistRef.current?.scrollToIndex({ index: index });
    setShowLocationModal(false);
  };
  const searchProps = {
    showLocationModal,
    handleTextDebounce,
    showSearch,
    toggleSearch,
    searchResultLocations,
    handleLocation,
    weatherScreens,
    currentCardIndex,
  };
  const handleShowLocationModal = (visible: boolean) =>
    setShowLocationModal(visible);

  // SafeAreaView causes flicker on mount, so get insets directly and use as padding
  const insets = useSafeAreaInsets();

  // Preload expo icons since async to prevent delay in image
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...FontAwesome6.font,
  });

  if (loading || !fontsLoaded) {
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

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />

      <CrossfadeImage
        style={{ width: "100%", height: "100%", position: "absolute" }}
        source={background}
        resizeMode="cover"
      />

      <LocationModal
        {...searchProps}
        goToWeatherScreen={(index: number) => handleShowWeatherScreen(index)}
        changeWeatherScreens={changeWeatherScreens}
      />

      <View
        className="flex flex-[0.95]"
        style={{
          paddingTop: insets.top,
        }}
      >
        <View className="h-full">
          {/* Bottom Footer */}

          {/* Weather at location */}
          <FlatList
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            ref={flatlistRef}
            data={dataProp}
            keyExtractor={(item: { id: string }) => item.id}
            renderItem={handleRenderItem}
            {...flatlistProps}
          />
        </View>
      </View>

      <BottomFooter
        scrollX={scrollX}
        weatherScreens={weatherScreens}
        setShowLocationModal={handleShowLocationModal}
      />
    </View>
  );
};
export default App;
