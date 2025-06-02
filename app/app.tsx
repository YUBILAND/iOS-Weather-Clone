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
  ImageStyle,
  StyleProp,
  TextInput,
  View,
  ViewToken,
} from "react-native";

import { fetchLocations } from "@/api/weather";
import Spinner from "@/components/atoms/Spinner";
import { getData } from "@/utils/asyncStorage";
import { debounce } from "lodash";
import "../global.css";

import WeatherAtLocation, {
  WeatherAtLocationProps,
} from "@/components/WeatherAtLocation";
import { useWindowDimensions } from "react-native";

import BottomFooter from "@/components/atoms/BottomFooter";
import { Location } from "@/constants/constants";
import { fetchExtraDataArr, fetchWeatherDataArr } from "@/state/api/apiSlice";
import { AppDispatch, RootState } from "@/state/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

import { getBackground } from "@/components/helper-functions/helperFunctions";
import LocationModal from "@/components/location-modal/LocationModal";
import MapModal from "@/components/map-modal/MapModal";
import WeatherScreenModalContainer from "@/components/weather-screen/WeatherScreenModalContainer";
import { useExtraData, useExtraLoading } from "@/hooks/useWeatherData";
import {
  fetchIs12Hr,
  fetchOtherUnits,
  fetchTempUnit,
} from "@/state/settings/settingsSlice";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { CrossfadeImage } from "react-native-crossfade-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const resetWeatherScreens = (reset: boolean) => {
  reset && AsyncStorage.clear();
};

const App = () => {
  // Delete All Weather Screens
  resetWeatherScreens(false);

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
    await dispatch(fetchWeatherDataArr({}));

    const cityArray = await getData("city");
    setWeatherScreens(cityArray);
    await dispatch(fetchExtraDataArr(cityArray));
  };

  useEffect(() => {
    // await dispatch(fetchWeatherDataArr({}));
    FirstCity();

    // Should fetch from async storage and update redux
    [fetchTempUnit(), fetchIs12Hr(), fetchOtherUnits()].forEach(dispatch);
  }, []);

  // Add New Weather Location when click on city name
  const handleAddCity = async (location: Location) => {
    setShowLocationModal(false);

    try {
      const cityList = await dispatch(
        fetchWeatherDataArr({ cityName: location.name })
      );
      setShowSearch(false);
      setSearchResultLocations([]);
      console.log("city list is", cityList);
      // Add to flatlist upon click city
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
  const background = getBackground(currentCityName);

  // For FlatList
  const flatlistRef = useRef<FlatList>(null);
  // Expanding dots library requires Animated.value instead of shared value
  const scrollX = new Animated.Value(0);
  const dataProp: Array<{ id: string } & WeatherAtLocationProps> = useMemo(
    () =>
      weatherScreens.map((city, index) => ({
        id: city,
        cityName: city,
        showMapModal: showMapModal,
      })),
    [weatherScreens]
  );
  const { width } = useWindowDimensions();
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
      return (
        <>
          <WeatherAtLocation {...restProps} />
        </>
      );
    },
    []
  );

  // For Location Modal
  const [showLocationModal, setShowLocationModal] = useState(false);
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
    handleAddCity,
    weatherScreens,
    currentCardIndex,
  };

  const [showMapModal, setShowMapModal] = useState(false);

  const handleCloseMap = useCallback(() => setShowMapModal(false), []);

  // SafeAreaView causes flicker on mount, so get insets directly and use as padding
  const insets = useSafeAreaInsets();

  // Preload expo icons since async to prevent delay in image
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...FontAwesome6.font,
  });

  const extraData = useExtraData();
  const extraLoading = useExtraLoading();
  const extraDataExists = extraData && Object.keys(extraData).length > 0;

  if (loading || !fontsLoaded || extraLoading || !extraDataExists) {
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

  const ShowMapModal = () => {
    const MapModalProps = {
      currentCardIndex,
      cityName: weatherScreens[currentCardIndex],
      closeMap: handleCloseMap,
      goToWeatherScreen: handleShowWeatherScreen,
      weatherScreens,
    };
    return (
      <WeatherScreenModalContainer modalVisible={showMapModal}>
        <MapModal {...MapModalProps} />
      </WeatherScreenModalContainer>
    );
  };

  const LocationModalProps = {
    ...searchProps,
    goToWeatherScreen: handleShowWeatherScreen,
    changeWeatherScreens,
  };

  const FlatListProps = {
    onViewableItemsChanged: handleViewableItemsChanged,
    viewabilityConfig: { itemVisiblePercentThreshold: 50 },
    ref: flatlistRef,
    data: dataProp,
    keyExtractor: (item: { id: string }) => item.id,
    renderItem: handleRenderItem,
    ...flatlistProps,
  };

  const BottomFooterProps = {
    scrollX,
    weatherScreens,
    setShowLocationModal,
    setShowMapModal,
  };

  const CrossFadeImageProps = {
    style: {
      width: "100%",
      height: "100%",
      position: "absolute",
    } as StyleProp<ImageStyle>,
    source: background,
    resizeMode: "cover" as const,
  };

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <CrossfadeImage {...CrossFadeImageProps} />
      <LocationModal {...LocationModalProps} />
      <ShowMapModal />
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top,
        }}
      >
        {/* WeatherScreen Flatlist */}
        <FlatList {...FlatListProps} />
      </View>
      <View className="mb-8">
        <BottomFooter {...BottomFooterProps} />
      </View>
    </View>
  );
};
export default App;
